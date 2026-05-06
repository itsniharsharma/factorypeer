import { MongoServerError } from "mongodb";
import { Types } from "mongoose";
import { withTransaction } from "../db/with-transaction.js";
import { AppError } from "../errors/app-error.js";
import { CatalogErrorCodes, productHasVariants, productSlugTaken, resourceNotFound, skuTaken, specRowNotLinkedToProductFamily, variantPublishRequiresSpecRow, } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import { invalidateCatalogCache } from "../utils/cache.js";
import { adminCacheAside } from "../utils/admin-cache.js";
function mediaPublicIds(media) {
    const s = new Set();
    for (const m of media ?? []) {
        const id = typeof m.publicId === "string" ? m.publicId.trim() : "";
        if (id)
            s.add(id);
    }
    return s;
}
function eo(ctx, session) {
    return { actorId: ctx?.actorUserId ?? undefined, session };
}
function eoSelect(ctx, session, select) {
    return { actorId: ctx?.actorUserId ?? undefined, session, select };
}
function mapMongoDuplicate(err) {
    if (!(err instanceof MongoServerError) || err.code !== 11000)
        return null;
    const k = err.keyValue;
    if (k?.["slug"] !== undefined) {
        return productSlugTaken(String(k["slug"]));
    }
    if (k?.["sku"] !== undefined) {
        return skuTaken(String(k["sku"]));
    }
    return new AppError("Another record already uses this unique identifier (duplicate key).", 409, CatalogErrorCodes.DUPLICATE_KEY);
}
export class ProductService {
    products;
    variants;
    specRows;
    categories;
    specSchemas;
    cloudinary;
    constructor(products, variants, specRows, categories, specSchemas, cloudinary) {
        this.products = products;
        this.variants = variants;
        this.specRows = specRows;
        this.categories = categories;
        this.specSchemas = specSchemas;
        this.cloudinary = cloudinary;
    }
    async productRequiresPublishedFamilySpec(product, ctx) {
        const ids = product.categoryIds ?? [];
        for (const cid of ids) {
            const cat = await this.categories.findById(cid, eo(ctx));
            if (!cat || cat.kind !== "family" || !cat.activeSpecSchemaId)
                continue;
            const sch = await this.specSchemas.findById(cat.activeSpecSchemaId, eo(ctx));
            if (sch && String(sch.status) === "published")
                return true;
        }
        return false;
    }
    pickBindingRow(rows, variantId) {
        if (rows.length === 1)
            return rows[0]._id;
        const pri = rows.find((r) => r.variantBindings?.some((b) => b.productVariantId.equals(variantId) && (b.role ?? "primary") === "primary"));
        return (pri ?? rows[0])._id;
    }
    async assertPublishedSpecRowMatchesProduct(specRowId, product, ctx) {
        const row = await this.specRows.findById(specRowId, eo(ctx));
        if (!row || String(row.status) !== "published")
            throw specRowNotLinkedToProductFamily();
        const tax = row.taxonomyNodeId;
        const pids = (product.categoryIds ?? []).map((x) => x.toString());
        if (!pids.includes(tax.toString()))
            throw specRowNotLinkedToProductFamily();
        const cat = await this.categories.findById(tax, eo(ctx));
        if (!cat || !cat.activeSpecSchemaId)
            throw specRowNotLinkedToProductFamily();
        if (!cat.activeSpecSchemaId.equals(row.specSchemaId)) {
            throw specRowNotLinkedToProductFamily();
        }
        const sch = await this.specSchemas.findById(row.specSchemaId, eo(ctx));
        if (!sch || String(sch.status) !== "published")
            throw specRowNotLinkedToProductFamily();
    }
    async autoResolveSpecRowIdFromBindings(variantId, product, ctx) {
        const out = [];
        const ids = product.categoryIds ?? [];
        for (const cid of ids) {
            const cat = await this.categories.findById(cid, eo(ctx));
            if (!cat || cat.kind !== "family" || !cat.activeSpecSchemaId)
                continue;
            const sch = await this.specSchemas.findById(cat.activeSpecSchemaId, eo(ctx));
            if (!sch || String(sch.status) !== "published")
                continue;
            const rows = await this.specRows.listPublishedContainingVariant(sch._id, variantId, eo(ctx));
            for (const r of rows) {
                out.push({
                    _id: r._id,
                    variantBindings: r.variantBindings,
                });
            }
        }
        if (out.length === 0)
            return null;
        const byId = new Map();
        for (const r of out)
            byId.set(r._id.toString(), r);
        return this.pickBindingRow([...byId.values()], variantId);
    }
    /**
     * Sets variant.specRowId when the variant is published, family requires a schema link,
     * and a published spec row already lists this variant in variantBindings.
     */
    async tryBackfillSpecRowIdFromBindings(variantId, ctx) {
        const v = await this.variants.findById(toObjectId(variantId), eo(ctx));
        if (!v || String(v.status) !== "published" || v.specRowId)
            return "skipped";
        const product = await this.products.findById(v.productId, eo(ctx));
        if (!product)
            return "skipped";
        if (!(await this.productRequiresPublishedFamilySpec(product, ctx)))
            return "skipped";
        const rid = await this.autoResolveSpecRowIdFromBindings(v._id, product, ctx);
        if (!rid)
            return "skipped";
        await this.variants.updateById(v._id, { specRowId: rid }, eo(ctx));
        return "linked";
    }
    async list(skip = 0, limit = 100, filter, ctx) {
        const filterKey = JSON.stringify({
            skip,
            limit,
            status: filter?.status ?? null,
            q: filter?.q ?? null,
            sort: filter?.sort ?? null,
            categoryId: filter?.categoryId?.toString() ?? null,
            ids: (filter?.ids ?? []).map((id) => id.toString()),
        });
        return adminCacheAside({
            scope: "product",
            key: `list:${filterKey}`,
            ttlSeconds: 90,
            staleWhileRevalidateSeconds: 30,
            loader: async () => {
                const [items, total] = await Promise.all([
                    this.products.list(skip, limit, filter, eo(ctx)),
                    this.products.count(filter, eo(ctx)),
                ]);
                return { items, total };
            },
        });
    }
    /**
     * Batch PDP relation cards: one product list + one aggregation for primary variants
     * (avoids N+1 variant fetches from the storefront).
     */
    async summaryCardsForProductIds(ids, ctx) {
        const cacheIds = [...new Set(ids.map((x) => x.trim()).filter(Boolean))].slice(0, 100);
        const cacheKey = cacheIds.join(",");
        return adminCacheAside({
            scope: "product",
            key: `summary-cards:${cacheKey}`,
            ttlSeconds: 90,
            staleWhileRevalidateSeconds: 30,
            loader: async () => {
                const unique = [...new Set(ids.map((x) => x.trim()).filter(Boolean))].slice(0, 100);
                if (!unique.length)
                    return [];
                const oids = unique.map(toObjectId);
                const items = await this.products.findByIds(oids, eoSelect(ctx, undefined, "slug title brand status"));
                const byId = new Map(items.filter((p) => String(p.status) === "published").map((p) => [p._id.toString(), p]));
                const ordered = unique.map((id) => byId.get(id)).filter((p) => Boolean(p));
                if (!ordered.length)
                    return [];
                const variantMap = await this.variants.firstPublishedVariantPerProduct(ordered.map((p) => p._id), eo(ctx));
                return ordered.map((p) => {
                    const pid = p._id.toString();
                    const v = variantMap.get(pid);
                    const price = v?.unitPrice && v?.currency ? `${v.unitPrice} ${v.currency}` : v?.unitPrice ?? "—";
                    return {
                        productId: pid,
                        slug: p.slug,
                        title: p.title,
                        brand: p.brand,
                        sku: v?.sku ?? "—",
                        itemNumber: v?.itemNumber,
                        mpn: v?.mpn?.trim() || undefined,
                        manufacturer: v?.manufacturer ?? p.brand,
                        price,
                        uom: v?.uom ?? "Each",
                        availability: v?.availability ?? "—",
                    };
                });
            },
        });
    }
    /** Storefront: resolve a variant to its parent product (slug, title) for spec matrix links. */
    async getVariantWithProduct(variantId, ctx) {
        const v = await this.variants.findById(toObjectId(variantId), eoSelect(ctx, undefined, "productId sku itemNumber mpn manufacturer unitPrice currency availability uom leadTime moq packaging status specRowId searchBlob sortOrder"));
        if (!v)
            throw resourceNotFound("ProductVariant", variantId);
        const p = await this.products.findById(v.productId, eoSelect(ctx, undefined, "slug title brand status"));
        if (!p)
            throw resourceNotFound("Product", v.productId.toString());
        return {
            variant: v.toObject(),
            product: p.toObject(),
        };
    }
    /**
     * Storefront spec matrix: batch-resolve variants + parent products (replaces per-row GET /variants/:id).
     * Returns only ids that exist; order follows `ids` (first occurrence). Max 500 ids per request.
     */
    async getVariantsWithProductsByIds(ids, ctx) {
        const unique = [...new Set(ids.map((x) => x.trim()).filter(Boolean))].slice(0, 500);
        return adminCacheAside({
            scope: "product",
            key: `variant-bundles:${unique.join(",")}`,
            ttlSeconds: 90,
            staleWhileRevalidateSeconds: 30,
            loader: async () => {
                if (!unique.length)
                    return [];
                const oids = [];
                for (const id of unique) {
                    if (Types.ObjectId.isValid(id))
                        oids.push(new Types.ObjectId(id));
                }
                if (!oids.length)
                    return [];
                const variants = await this.variants.findByIds(oids, eoSelect(ctx, undefined, "productId sku itemNumber mpn manufacturer unitPrice currency availability uom leadTime moq packaging status specRowId searchBlob sortOrder"));
                if (!variants.length)
                    return [];
                const vById = new Map(variants.map((v) => [v._id.toString(), v]));
                const pids = [...new Set(variants.map((v) => v.productId))];
                const products = await this.products.findByIds(pids, eoSelect(ctx, undefined, "slug title brand status"));
                const pMap = new Map(products.map((p) => [p._id.toString(), p]));
                const out = [];
                for (const id of unique) {
                    const v = vById.get(id);
                    if (!v)
                        continue;
                    const p = pMap.get(v.productId.toString());
                    if (!p)
                        continue;
                    out.push({ variant: v.toObject(), product: p.toObject() });
                }
                return out;
            },
        });
    }
    async getProduct(id, ctx) {
        return adminCacheAside({
            scope: "product",
            key: `product:${id}`,
            ttlSeconds: 120,
            staleWhileRevalidateSeconds: 30,
            loader: async () => {
                const p = await this.products.findById(toObjectId(id), eo(ctx));
                if (!p)
                    throw resourceNotFound("Product", id);
                return p;
            },
        });
    }
    async createProduct(input, ctx) {
        const existing = await this.products.findBySlug(input.slug, eo(ctx));
        if (existing) {
            throw productSlugTaken(input.slug);
        }
        try {
            const created = await this.products.create({
                slug: input.slug,
                title: input.title,
                brand: input.brand,
                status: input.status,
                categoryIds: input.categoryIds?.map((x) => toObjectId(x)),
                searchText: input.searchText,
                sortOrder: input.sortOrder,
                media: input.media,
                longDescription: input.longDescription,
                features: input.features,
                applications: input.applications,
                marketingBullets: input.marketingBullets,
                attachments: input.attachments,
                relatedProductIds: input.relatedProductIds?.map((x) => toObjectId(x)),
                compatibleProductIds: input.compatibleProductIds?.map((x) => toObjectId(x)),
                recommendedProductIds: input.recommendedProductIds?.map((x) => toObjectId(x)),
                shippingWeight: input.shippingWeight,
                branchAvailabilityPlaceholder: input.branchAvailabilityPlaceholder,
                logisticsMeta: input.logisticsMeta,
            }, eo(ctx));
            await invalidateCatalogCache(["product", "search", "category", "homepage"]);
            return created;
        }
        catch (e) {
            const mapped = mapMongoDuplicate(e);
            if (mapped)
                throw mapped;
            throw e;
        }
    }
    async updateProduct(id, patch, ctx) {
        if (patch.slug) {
            const hit = await this.products.findBySlug(patch.slug, eo(ctx));
            if (hit && hit._id.toString() !== id) {
                throw productSlugTaken(patch.slug);
            }
        }
        let orphanPublicIds = [];
        if (patch.media !== undefined) {
            const prev = await this.products.findById(toObjectId(id), eo(ctx));
            if (!prev)
                throw resourceNotFound("Product", id);
            const before = mediaPublicIds(prev.media);
            const after = mediaPublicIds(patch.media);
            orphanPublicIds = [...before].filter((x) => !after.has(x));
        }
        try {
            const p = await this.products.updateById(toObjectId(id), {
                ...patch,
                categoryIds: patch.categoryIds?.map((x) => toObjectId(x)),
                relatedProductIds: patch.relatedProductIds?.map((x) => toObjectId(x)),
                compatibleProductIds: patch.compatibleProductIds?.map((x) => toObjectId(x)),
                recommendedProductIds: patch.recommendedProductIds?.map((x) => toObjectId(x)),
                defaultVariantId: patch.defaultVariantId === undefined
                    ? undefined
                    : patch.defaultVariantId
                        ? toObjectId(patch.defaultVariantId)
                        : null,
                publishedAt: patch.status === "published" ? new Date() : undefined,
            }, eo(ctx));
            if (!p)
                throw resourceNotFound("Product", id);
            for (const pid of orphanPublicIds)
                await this.cloudinary.destroy(pid);
            await invalidateCatalogCache(["product", "search", "category", "homepage"]);
            return p;
        }
        catch (e) {
            const mapped = mapMongoDuplicate(e);
            if (mapped)
                throw mapped;
            throw e;
        }
    }
    async deleteProduct(id, ctx) {
        const oid = toObjectId(id);
        const vs = await this.variants.listByProduct(oid, eo(ctx));
        if (vs.length > 0) {
            throw productHasVariants();
        }
        const existing = await this.products.findById(oid, eo(ctx));
        const deleted = await this.products.deleteById(oid, eo(ctx));
        for (const m of existing?.media ?? []) {
            const pid = typeof m.publicId === "string" ? m.publicId.trim() : "";
            if (pid)
                await this.cloudinary.destroy(pid);
        }
        await invalidateCatalogCache(["product", "search", "category", "homepage"]);
        return deleted;
    }
    async listVariants(productId, ctx, opts) {
        const pid = toObjectId(productId);
        return adminCacheAside({
            scope: "product",
            key: `variants:${productId}:${opts?.status ?? "any"}:${opts?.q ?? ""}:${opts?.skip ?? 0}:${opts?.limit ?? 500}`,
            ttlSeconds: 90,
            staleWhileRevalidateSeconds: 30,
            loader: async () => {
                const [items, total] = await Promise.all([
                    this.variants.listByProduct(pid, { ...eo(ctx), ...opts }),
                    this.variants.countByProduct(pid, { ...eo(ctx), status: opts?.status, q: opts?.q }),
                ]);
                return { items, total };
            },
        });
    }
    async createVariant(productId, input, ctx) {
        const product = await this.products.findById(toObjectId(productId), eo(ctx));
        if (!product)
            throw resourceNotFound("Product", productId);
        const nextStatus = input.status ?? "draft";
        let specOid = input.specRowId === undefined
            ? undefined
            : input.specRowId
                ? toObjectId(input.specRowId)
                : null;
        if (nextStatus === "published" && (await this.productRequiresPublishedFamilySpec(product, ctx))) {
            if (!specOid)
                throw variantPublishRequiresSpecRow();
            await this.assertPublishedSpecRowMatchesProduct(specOid, product, ctx);
        }
        try {
            const created = await this.variants.create({
                productId: toObjectId(productId),
                sku: input.sku,
                itemNumber: input.itemNumber,
                mpn: input.mpn,
                manufacturer: input.manufacturer,
                unitPrice: input.unitPrice,
                currency: input.currency,
                availability: input.availability,
                uom: input.uom,
                leadTime: input.leadTime,
                moq: input.moq,
                packaging: input.packaging,
                status: input.status,
                specRowId: specOid === undefined ? undefined : specOid,
                searchBlob: input.searchBlob,
                sortOrder: input.sortOrder,
            }, eo(ctx));
            await invalidateCatalogCache(["product", "search", "category", "homepage"]);
            return created;
        }
        catch (e) {
            const mapped = mapMongoDuplicate(e);
            if (mapped)
                throw mapped;
            throw e;
        }
    }
    async updateVariant(variantId, patch, ctx) {
        const existing = await this.variants.findById(toObjectId(variantId), eo(ctx));
        if (!existing)
            throw resourceNotFound("ProductVariant", variantId);
        const product = await this.products.findById(existing.productId, eo(ctx));
        if (!product)
            throw resourceNotFound("Product", existing.productId.toString());
        let resolvedSpec = patch.specRowId === undefined
            ? undefined
            : patch.specRowId
                ? toObjectId(patch.specRowId)
                : null;
        const nextStatus = patch.status ?? String(existing.status ?? "draft");
        if (nextStatus === "published" && (await this.productRequiresPublishedFamilySpec(product, ctx))) {
            let effective = resolvedSpec !== undefined ? resolvedSpec : existing.specRowId ?? null;
            if (!effective) {
                const auto = await this.autoResolveSpecRowIdFromBindings(existing._id, product, ctx);
                if (auto)
                    effective = auto;
            }
            if (!effective)
                throw variantPublishRequiresSpecRow();
            await this.assertPublishedSpecRowMatchesProduct(effective, product, ctx);
            resolvedSpec = effective;
        }
        try {
            const v = await this.variants.updateById(toObjectId(variantId), {
                ...patch,
                specRowId: resolvedSpec,
                publishedAt: patch.status === "published" ? new Date() : undefined,
            }, eo(ctx));
            if (!v)
                throw resourceNotFound("ProductVariant", variantId);
            await invalidateCatalogCache(["product", "search", "category", "homepage"]);
            return v;
        }
        catch (e) {
            const mapped = mapMongoDuplicate(e);
            if (mapped)
                throw mapped;
            throw e;
        }
    }
    async deleteVariant(variantId, ctx) {
        const deleted = await this.variants.deleteById(toObjectId(variantId), eo(ctx));
        await invalidateCatalogCache(["product", "search", "category", "homepage"]);
        return deleted;
    }
    /**
     * Links a variant to a matrix row and optionally merges into row.variantBindings.
     */
    async linkVariantToRow(variantId, input, ctx) {
        return withTransaction(async (session) => {
            const opt = eo(ctx, session);
            const variant = await this.variants.findById(toObjectId(variantId), opt);
            if (!variant)
                throw resourceNotFound("ProductVariant", variantId);
            const row = await this.specRows.findById(toObjectId(input.specRowId), opt);
            if (!row)
                throw resourceNotFound("CatalogSpecRow", input.specRowId);
            const product = await this.products.findById(variant.productId, opt);
            if (product && row.taxonomyNodeId) {
                const pids = (product.categoryIds ?? []).map((x) => x.toString());
                if (!pids.includes(row.taxonomyNodeId.toString())) {
                    throw specRowNotLinkedToProductFamily();
                }
            }
            await this.variants.updateById(toObjectId(variantId), {
                specRowId: toObjectId(input.specRowId),
            }, opt);
            if (input.syncBindings !== false) {
                const raw = (row.variantBindings ?? []);
                const vid = toObjectId(variantId);
                let next = raw
                    .filter((b) => !b.productVariantId.equals(vid))
                    .map((b, i) => ({
                    productVariantId: b.productVariantId,
                    role: b.role ?? "alternate",
                    sortOrder: typeof b.sortOrder === "number" ? b.sortOrder : i,
                }));
                const role = input.bindingRole ?? "primary";
                if (role === "primary") {
                    next = next.map((b) => b.role === "primary" ? { ...b, role: "alternate" } : b);
                }
                next.push({
                    productVariantId: vid,
                    role,
                    sortOrder: next.length,
                });
                await this.specRows.updateById(toObjectId(input.specRowId), {
                    variantBindings: next,
                }, opt);
            }
            const updated = await this.variants.findById(toObjectId(variantId), opt);
            await invalidateCatalogCache(["product", "search", "category", "homepage"]);
            return updated;
        });
    }
}

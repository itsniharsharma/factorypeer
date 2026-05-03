import { MongoServerError } from "mongodb";
import { withTransaction } from "../db/with-transaction.js";
import { AppError } from "../errors/app-error.js";
import { CatalogErrorCodes, productHasVariants, productSlugTaken, resourceNotFound, skuTaken, } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
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
    cloudinary;
    constructor(products, variants, specRows, cloudinary) {
        this.products = products;
        this.variants = variants;
        this.specRows = specRows;
        this.cloudinary = cloudinary;
    }
    async list(skip = 0, limit = 100, filter, ctx) {
        const [items, total] = await Promise.all([
            this.products.list(skip, limit, filter, eo(ctx)),
            this.products.count(filter, eo(ctx)),
        ]);
        return { items, total };
    }
    /**
     * Batch PDP relation cards: one product list + one aggregation for primary variants
     * (avoids N+1 variant fetches from the storefront).
     */
    async summaryCardsForProductIds(ids, ctx) {
        const unique = [...new Set(ids.map((x) => x.trim()).filter(Boolean))].slice(0, 48);
        if (!unique.length)
            return [];
        const oids = unique.map(toObjectId);
        const { items } = await this.list(0, 48, { status: "published", ids: oids }, ctx);
        const byId = new Map(items.map((p) => [p._id.toString(), p]));
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
                manufacturer: v?.manufacturer ?? p.brand,
                price,
                uom: v?.uom ?? "Each",
                availability: v?.availability ?? "—",
            };
        });
    }
    /** Storefront: resolve a variant to its parent product (slug, title) for spec matrix links. */
    async getVariantWithProduct(variantId, ctx) {
        const v = await this.variants.findById(toObjectId(variantId), eo(ctx));
        if (!v)
            throw resourceNotFound("ProductVariant", variantId);
        const p = await this.products.findById(v.productId, eo(ctx));
        if (!p)
            throw resourceNotFound("Product", v.productId.toString());
        return {
            variant: v.toObject(),
            product: p.toObject(),
        };
    }
    async getProduct(id, ctx) {
        const p = await this.products.findById(toObjectId(id), eo(ctx));
        if (!p)
            throw resourceNotFound("Product", id);
        return p;
    }
    async createProduct(input, ctx) {
        const existing = await this.products.findBySlug(input.slug, eo(ctx));
        if (existing) {
            throw productSlugTaken(input.slug);
        }
        try {
            return await this.products.create({
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
        return deleted;
    }
    async listVariants(productId, ctx, opts) {
        const pid = toObjectId(productId);
        const [items, total] = await Promise.all([
            this.variants.listByProduct(pid, { ...eo(ctx), ...opts }),
            this.variants.countByProduct(pid, { ...eo(ctx), status: opts?.status, q: opts?.q }),
        ]);
        return { items, total };
    }
    async createVariant(productId, input, ctx) {
        const product = await this.products.findById(toObjectId(productId), eo(ctx));
        if (!product)
            throw resourceNotFound("Product", productId);
        try {
            return await this.variants.create({
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
                specRowId: input.specRowId ? toObjectId(input.specRowId) : input.specRowId === null ? null : undefined,
                searchBlob: input.searchBlob,
                sortOrder: input.sortOrder,
            }, eo(ctx));
        }
        catch (e) {
            const mapped = mapMongoDuplicate(e);
            if (mapped)
                throw mapped;
            throw e;
        }
    }
    async updateVariant(variantId, patch, ctx) {
        try {
            const v = await this.variants.updateById(toObjectId(variantId), {
                ...patch,
                specRowId: patch.specRowId === undefined
                    ? undefined
                    : patch.specRowId
                        ? toObjectId(patch.specRowId)
                        : null,
                publishedAt: patch.status === "published" ? new Date() : undefined,
            }, eo(ctx));
            if (!v)
                throw resourceNotFound("ProductVariant", variantId);
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
        return this.variants.deleteById(toObjectId(variantId), eo(ctx));
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
            return this.variants.findById(toObjectId(variantId), opt);
        });
    }
}

import { MongoServerError } from "mongodb";
import type { ClientSession, Types } from "mongoose";
import type { ProductRepository, ProductListFilter } from "../repositories/product.repository.js";
import type { ProductVariantRepository, VariantListFilter } from "../repositories/product-variant.repository.js";
import type { SpecRowRepository } from "../repositories/spec-row.repository.js";
import type { ExecOpts } from "../repositories/exec-opts.js";
import { withTransaction } from "../db/with-transaction.js";
import { AppError } from "../errors/app-error.js";
import {
  CatalogErrorCodes,
  productHasVariants,
  productSlugTaken,
  resourceNotFound,
  skuTaken,
} from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";

function eo(ctx?: WriteContext, session?: ClientSession): ExecOpts {
  return { actorId: ctx?.actorUserId ?? undefined, session };
}

function mapMongoDuplicate(err: unknown): AppError | null {
  if (!(err instanceof MongoServerError) || err.code !== 11000) return null;
  const k = err.keyValue as Record<string, unknown> | undefined;
  if (k?.["slug"] !== undefined) {
    return productSlugTaken(String(k["slug"]));
  }
  if (k?.["sku"] !== undefined) {
    return skuTaken(String(k["sku"]));
  }
  return new AppError(
    "Another record already uses this unique identifier (duplicate key).",
    409,
    CatalogErrorCodes.DUPLICATE_KEY,
  );
}

export class ProductService {
  constructor(
    private readonly products: ProductRepository,
    private readonly variants: ProductVariantRepository,
    private readonly specRows: SpecRowRepository,
  ) {}

  async list(skip = 0, limit = 100, filter?: ProductListFilter, ctx?: WriteContext) {
    const [items, total] = await Promise.all([
      this.products.list(skip, limit, filter, eo(ctx)),
      this.products.count(filter, eo(ctx)),
    ]);
    return { items, total };
  }

  /** Storefront: resolve a variant to its parent product (slug, title) for spec matrix links. */
  async getVariantWithProduct(variantId: string, ctx?: WriteContext) {
    const v = await this.variants.findById(toObjectId(variantId), eo(ctx));
    if (!v) throw resourceNotFound("ProductVariant", variantId);
    const p = await this.products.findById(v.productId, eo(ctx));
    if (!p) throw resourceNotFound("Product", v.productId.toString());
    return {
      variant: v.toObject(),
      product: p.toObject(),
    };
  }

  async getProduct(id: string, ctx?: WriteContext) {
    const p = await this.products.findById(toObjectId(id), eo(ctx));
    if (!p) throw resourceNotFound("Product", id);
    return p;
  }

  async createProduct(
    input: {
      slug: string;
      title: string;
      brand?: string;
      status?: string;
      categoryIds?: string[];
      searchText?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    const existing = await this.products.findBySlug(input.slug, eo(ctx));
    if (existing) {
      throw productSlugTaken(input.slug);
    }
    try {
      return await this.products.create(
        {
          slug: input.slug,
          title: input.title,
          brand: input.brand,
          status: input.status,
          categoryIds: input.categoryIds?.map((x) => toObjectId(x)),
          searchText: input.searchText,
          sortOrder: input.sortOrder,
        },
        eo(ctx),
      );
    } catch (e) {
      const mapped = mapMongoDuplicate(e);
      if (mapped) throw mapped;
      throw e;
    }
  }

  async updateProduct(
    id: string,
    patch: {
      slug?: string;
      title?: string;
      brand?: string | null;
      status?: string;
      categoryIds?: string[];
      searchText?: string;
      sortOrder?: number;
      defaultVariantId?: string | null;
    },
    ctx?: WriteContext,
  ) {
    if (patch.slug) {
      const hit = await this.products.findBySlug(patch.slug, eo(ctx));
      if (hit && hit._id.toString() !== id) {
        throw productSlugTaken(patch.slug);
      }
    }
    try {
      const p = await this.products.updateById(
        toObjectId(id),
        {
          ...patch,
          categoryIds: patch.categoryIds?.map((x) => toObjectId(x)),
          defaultVariantId:
            patch.defaultVariantId === undefined
              ? undefined
              : patch.defaultVariantId
                ? toObjectId(patch.defaultVariantId)
                : null,
          publishedAt: patch.status === "published" ? new Date() : undefined,
        },
        eo(ctx),
      );
      if (!p) throw resourceNotFound("Product", id);
      return p;
    } catch (e) {
      const mapped = mapMongoDuplicate(e);
      if (mapped) throw mapped;
      throw e;
    }
  }

  async deleteProduct(id: string, ctx?: WriteContext) {
    const oid = toObjectId(id);
    const vs = await this.variants.listByProduct(oid, eo(ctx));
    if (vs.length > 0) {
      throw productHasVariants();
    }
    return this.products.deleteById(oid, eo(ctx));
  }

  async listVariants(
    productId: string,
    ctx?: WriteContext,
    opts?: VariantListFilter & { skip?: number; limit?: number },
  ) {
    const pid = toObjectId(productId);
    const [items, total] = await Promise.all([
      this.variants.listByProduct(pid, { ...eo(ctx), ...opts }),
      this.variants.countByProduct(pid, { ...eo(ctx), status: opts?.status, q: opts?.q }),
    ]);
    return { items, total };
  }

  async createVariant(
    productId: string,
    input: {
      sku: string;
      itemNumber?: string;
      mpn?: string;
      manufacturer?: string;
      unitPrice?: string;
      currency?: string;
      availability?: string;
      uom?: string;
      status?: string;
      specRowId?: string | null;
      searchBlob?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    const product = await this.products.findById(toObjectId(productId), eo(ctx));
    if (!product) throw resourceNotFound("Product", productId);
    try {
      return await this.variants.create(
        {
          productId: toObjectId(productId),
          sku: input.sku,
          itemNumber: input.itemNumber,
          mpn: input.mpn,
          manufacturer: input.manufacturer,
          unitPrice: input.unitPrice,
          currency: input.currency,
          availability: input.availability,
          uom: input.uom,
          status: input.status,
          specRowId: input.specRowId ? toObjectId(input.specRowId) : input.specRowId === null ? null : undefined,
          searchBlob: input.searchBlob,
          sortOrder: input.sortOrder,
        },
        eo(ctx),
      );
    } catch (e) {
      const mapped = mapMongoDuplicate(e);
      if (mapped) throw mapped;
      throw e;
    }
  }

  async updateVariant(
    variantId: string,
    patch: {
      sku?: string;
      itemNumber?: string | null;
      mpn?: string | null;
      manufacturer?: string | null;
      unitPrice?: string;
      currency?: string;
      availability?: string;
      uom?: string | null;
      status?: string;
      specRowId?: string | null;
      searchBlob?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    try {
      const v = await this.variants.updateById(
        toObjectId(variantId),
        {
          ...patch,
          specRowId:
            patch.specRowId === undefined
              ? undefined
              : patch.specRowId
                ? toObjectId(patch.specRowId)
                : null,
          publishedAt: patch.status === "published" ? new Date() : undefined,
        },
        eo(ctx),
      );
      if (!v) throw resourceNotFound("ProductVariant", variantId);
      return v;
    } catch (e) {
      const mapped = mapMongoDuplicate(e);
      if (mapped) throw mapped;
      throw e;
    }
  }

  async deleteVariant(variantId: string, ctx?: WriteContext) {
    return this.variants.deleteById(toObjectId(variantId), eo(ctx));
  }

  /**
   * Links a variant to a matrix row and optionally merges into row.variantBindings.
   */
  async linkVariantToRow(
    variantId: string,
    input: { specRowId: string; syncBindings?: boolean; bindingRole?: "primary" | "alternate" },
    ctx?: WriteContext,
  ) {
    return withTransaction(async (session) => {
      const opt = eo(ctx, session);
      const variant = await this.variants.findById(toObjectId(variantId), opt);
      if (!variant) throw resourceNotFound("ProductVariant", variantId);
      const row = await this.specRows.findById(toObjectId(input.specRowId), opt);
      if (!row) throw resourceNotFound("CatalogSpecRow", input.specRowId);

      await this.variants.updateById(
        toObjectId(variantId),
        {
          specRowId: toObjectId(input.specRowId),
        },
        opt,
      );

      if (input.syncBindings !== false) {
        type BindingSub = {
          productVariantId: Types.ObjectId;
          role?: string;
          sortOrder?: number;
        };
        const raw = (row.variantBindings ?? []) as BindingSub[];
        const vid = toObjectId(variantId);
        let next = raw
          .filter((b: BindingSub) => !b.productVariantId.equals(vid))
          .map((b: BindingSub, i: number) => ({
            productVariantId: b.productVariantId,
            role: (b.role as "primary" | "alternate") ?? "alternate",
            sortOrder: typeof b.sortOrder === "number" ? b.sortOrder : i,
          }));
        const role = input.bindingRole ?? "primary";
        if (role === "primary") {
          next = next.map((b: (typeof next)[number]) =>
            b.role === "primary" ? { ...b, role: "alternate" as const } : b,
          );
        }
        next.push({
          productVariantId: vid,
          role,
          sortOrder: next.length,
        });
        await this.specRows.updateById(
          toObjectId(input.specRowId),
          {
            variantBindings: next,
          },
          opt,
        );
      }

      return this.variants.findById(toObjectId(variantId), opt);
    });
  }
}

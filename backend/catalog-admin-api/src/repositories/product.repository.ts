import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { escapeRegex, tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export type ProductListFilter = {
  status?: string;
  /** Case-insensitive substring on title or slug */
  q?: string;
  sort?: "title" | "-title" | "updatedAt" | "-updatedAt" | "sortOrder";
  /** Products whose categoryIds contains this id */
  categoryId?: Types.ObjectId;
};

export class ProductRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async findById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.Product.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findBySlug(slug: string, opts?: ExecOpts) {
    const q = this.models.Product.findOne({ slug, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  /**
   * Product list search: title, slug, searchText, and any variant with matching sku / itemNumber / mpn.
   */
  private async buildListFilter(
    filter: ProductListFilter | undefined,
    opts?: ExecOpts,
  ): Promise<Record<string, unknown>> {
    const mongoFilter: Record<string, unknown> = { ...this.tq() };
    if (filter?.status) mongoFilter["status"] = filter.status;
    if (filter?.categoryId) mongoFilter["categoryIds"] = filter.categoryId;
    if (!filter?.q?.trim()) {
      return mongoFilter;
    }
    const q = filter.q.trim();
    const rx = new RegExp(escapeRegex(q), "i");
    let vq = this.models.ProductVariant.find({
      ...this.tq(),
      $or: [{ sku: rx }, { itemNumber: rx }, { mpn: rx }],
    }).select("productId");
    vq = opts?.session ? vq.session(opts.session) : vq;
    const variantRows = await vq.lean().exec();
    const variantPids = [
      ...new Set(variantRows.map((r) => r.productId).filter((id) => id != null)),
    ];
    const orClause: Record<string, unknown>[] = [
      { title: rx },
      { slug: rx },
      { searchText: rx },
    ];
    if (variantPids.length > 0) {
      orClause.push({ _id: { $in: variantPids } });
    }
    mongoFilter["$or"] = orClause;
    return mongoFilter;
  }

  async list(
    skip = 0,
    limit = 100,
    filter?: ProductListFilter,
    opts?: ExecOpts,
  ) {
    const mongoFilter = await this.buildListFilter(filter, opts);
    const sort = sortFromFilter(filter?.sort);
    let q = this.models.Product.find(mongoFilter).sort(sort).skip(skip).limit(limit);
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async count(filter?: ProductListFilter, opts?: ExecOpts) {
    const mongoFilter = await this.buildListFilter(filter, opts);
    let q = this.models.Product.countDocuments(mongoFilter);
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async create(
    data: {
      slug: string;
      title: string;
      brand?: string;
      status?: string;
      categoryIds?: Types.ObjectId[];
      searchText?: string;
      sortOrder?: number;
    },
    opts?: ExecOpts,
  ) {
    const doc = {
      tenantId: this.tenantId,
      slug: data.slug,
      title: data.title,
      brand: data.brand,
      status: data.status ?? "draft",
      categoryIds: data.categoryIds ?? [],
      searchText: data.searchText ?? "",
      sortOrder: data.sortOrder ?? 0,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.Product.create([doc], { session: opts.session });
      return created[0];
    }
    return this.models.Product.create(doc);
  }

  async updateById(
    id: Types.ObjectId,
    patch: Partial<{
      slug: string;
      title: string;
      brand: string | null;
      status: string;
      categoryIds: Types.ObjectId[];
      searchText: string;
      sortOrder: number;
      defaultVariantId: Types.ObjectId | null;
      publishedAt: Date | null;
    }>,
    opts?: ExecOpts,
  ) {
    const upd = buildAuditedUpdate(patch as Record<string, unknown>, opts?.actorId);
    return this.models.Product
      .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async deleteById(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.Product
      .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
      .exec();
  }
}

function sortFromFilter(
  sort?: ProductListFilter["sort"],
): Record<string, 1 | -1> {
  switch (sort) {
    case "-title":
      return { title: -1 };
    case "updatedAt":
      return { updatedAt: 1 };
    case "-updatedAt":
      return { updatedAt: -1 };
    case "sortOrder":
      return { sortOrder: 1, title: 1 };
    case "title":
    default:
      return { sortOrder: 1, title: 1 };
  }
}

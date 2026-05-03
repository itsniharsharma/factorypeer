import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export type VariantListFilter = {
  status?: string;
  q?: string;
};

export class ProductVariantRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async findById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.ProductVariant.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async listByProduct(
    productId: Types.ObjectId,
    opts?: ExecOpts & VariantListFilter & { skip?: number; limit?: number },
  ) {
    const filter: Record<string, unknown> = { productId, ...this.tq() };
    if (opts?.status) filter["status"] = opts.status;
    if (opts?.q?.trim()) {
      const rx = new RegExp(escapeRegex(opts.q.trim()), "i");
      filter["$or"] = [{ sku: rx }, { itemNumber: rx }, { mpn: rx }];
    }
    let q = this.models.ProductVariant.find(filter).sort({ sortOrder: 1, sku: 1 });
    if (opts?.skip != null) q = q.skip(opts.skip);
    if (opts?.limit != null) q = q.limit(opts.limit);
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async countByProduct(
    productId: Types.ObjectId,
    opts?: ExecOpts & VariantListFilter,
  ) {
    const filter: Record<string, unknown> = { productId, ...this.tq() };
    if (opts?.status) filter["status"] = opts.status;
    if (opts?.q?.trim()) {
      const rx = new RegExp(escapeRegex(opts.q.trim()), "i");
      filter["$or"] = [{ sku: rx }, { itemNumber: rx }, { mpn: rx }];
    }
    let q = this.models.ProductVariant.countDocuments(filter);
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async create(
    data: {
      productId: Types.ObjectId;
      sku: string;
      itemNumber?: string;
      mpn?: string;
      manufacturer?: string;
      unitPrice?: string;
      currency?: string;
      availability?: string;
      uom?: string;
      status?: string;
      specRowId?: Types.ObjectId | null;
      searchBlob?: string;
      sortOrder?: number;
    },
    opts?: ExecOpts,
  ) {
    const doc = {
      tenantId: this.tenantId,
      productId: data.productId,
      sku: data.sku,
      itemNumber: data.itemNumber,
      mpn: data.mpn,
      manufacturer: data.manufacturer,
      unitPrice: data.unitPrice ?? "",
      currency: data.currency ?? "USD",
      availability: data.availability ?? "",
      uom: data.uom,
      status: data.status ?? "draft",
      specRowId: data.specRowId ?? null,
      searchBlob: data.searchBlob ?? "",
      sortOrder: data.sortOrder ?? 0,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.ProductVariant.create([doc], { session: opts.session });
      return created[0];
    }
    return this.models.ProductVariant.create(doc);
  }

  async updateById(
    id: Types.ObjectId,
    patch: Partial<{
      sku: string;
      itemNumber: string | null;
      mpn: string | null;
      manufacturer: string | null;
      unitPrice: string;
      currency: string;
      availability: string;
      uom: string | null;
      status: string;
      specRowId: Types.ObjectId | null;
      searchBlob: string;
      sortOrder: number;
      publishedAt: Date | null;
    }>,
    opts?: ExecOpts,
  ) {
    const upd = buildAuditedUpdate(patch as Record<string, unknown>, opts?.actorId);
    return this.models.ProductVariant
      .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async deleteById(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.ProductVariant
      .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
      .exec();
  }

  async deleteByProduct(productId: Types.ObjectId, opts?: ExecOpts) {
    await this.models.ProductVariant.deleteMany(
      { productId, ...this.tq() },
      { session: opts?.session },
    ).exec();
  }

  async clearSpecRowLink(specRowId: Types.ObjectId, opts?: ExecOpts) {
    await this.models.ProductVariant.updateMany(
      { specRowId, ...this.tq() },
      {
        $set: { specRowId: null, ...(opts?.actorId ? { updatedBy: opts.actorId } : {}) },
        $inc: { documentVersion: 1 },
      },
      { session: opts?.session },
    ).exec();
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

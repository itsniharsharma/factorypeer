import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export type VariantBindingInput = {
  productVariantId: Types.ObjectId;
  role: "primary" | "alternate";
  sortOrder: number;
};

export class SpecRowRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async findById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CatalogSpecRow.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async listBySpecSchema(
    specSchemaId: Types.ObjectId,
    opts?: ExecOpts & {
      status?: string;
      skip?: number;
      limit?: number;
    },
  ) {
    const filter: Record<string, unknown> = { specSchemaId, ...this.tq() };
    if (opts?.status) filter["status"] = opts.status;
    let q = this.models.CatalogSpecRow.find(filter).sort({ sortOrder: 1, _id: 1 });
    if (opts?.skip != null) q = q.skip(opts.skip);
    if (opts?.limit != null) q = q.limit(opts.limit);
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async countBySpecSchema(
    specSchemaId: Types.ObjectId,
    opts?: ExecOpts & { status?: string },
  ) {
    const filter: Record<string, unknown> = { specSchemaId, ...this.tq() };
    if (opts?.status) filter["status"] = opts.status;
    let q = this.models.CatalogSpecRow.countDocuments(filter);
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async create(
    data: {
      specSchemaId: Types.ObjectId;
      taxonomyNodeId: Types.ObjectId;
      values: Record<string, string>;
      variantBindings: VariantBindingInput[];
      externalKey?: string;
      status?: string;
      sortOrder?: number;
    },
    opts?: ExecOpts,
  ) {
    const doc = {
      tenantId: this.tenantId,
      specSchemaId: data.specSchemaId,
      taxonomyNodeId: data.taxonomyNodeId,
      values: new Map(Object.entries(data.values)),
      variantBindings: data.variantBindings.map((b) => ({
        productVariantId: b.productVariantId,
        role: b.role,
        sortOrder: b.sortOrder,
      })),
      externalKey: data.externalKey,
      status: data.status ?? "draft",
      sortOrder: data.sortOrder ?? 0,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.CatalogSpecRow.create([doc], { session: opts.session });
      return created[0];
    }
    return this.models.CatalogSpecRow.create(doc);
  }

  async updateById(
    id: Types.ObjectId,
    patch: Partial<{
      values: Record<string, string>;
      variantBindings: VariantBindingInput[];
      externalKey: string | null;
      status: string;
      sortOrder: number;
    }>,
    opts?: ExecOpts,
  ) {
    const set: Record<string, unknown> = {};
    if (patch.values !== undefined) set["values"] = new Map(Object.entries(patch.values));
    if (patch.variantBindings !== undefined) {
      set["variantBindings"] = patch.variantBindings.map((b) => ({
        productVariantId: b.productVariantId,
        role: b.role,
        sortOrder: b.sortOrder,
      }));
    }
    if (patch.externalKey !== undefined) set["externalKey"] = patch.externalKey;
    if (patch.status !== undefined) set["status"] = patch.status;
    if (patch.sortOrder !== undefined) set["sortOrder"] = patch.sortOrder;

    const upd = buildAuditedUpdate(set, opts?.actorId);
    return this.models.CatalogSpecRow
      .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async deleteById(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.CatalogSpecRow
      .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
      .exec();
  }

  async deleteBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts) {
    await this.models.CatalogSpecRow.deleteMany(
      { specSchemaId, ...this.tq() },
      { session: opts?.session },
    ).exec();
  }

  async setSortOrders(
    pairs: Array<{ id: Types.ObjectId; sortOrder: number }>,
    opts?: ExecOpts,
  ) {
    const bulk = pairs.map((p) => ({
      updateOne: {
        filter: { _id: p.id, ...this.tq() },
        update: {
          $set: {
            sortOrder: p.sortOrder,
            ...(opts?.actorId ? { updatedBy: opts.actorId } : {}),
          },
          $inc: { documentVersion: 1 },
        },
      },
    }));
    if (bulk.length === 0) return;
    await this.models.CatalogSpecRow.bulkWrite(bulk, { session: opts?.session });
  }
}

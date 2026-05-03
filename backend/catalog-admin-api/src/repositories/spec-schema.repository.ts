import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export class SpecSchemaRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async findById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CatalogSpecSchema.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findActiveOrLatestForCategory(categoryId: Types.ObjectId, opts?: ExecOpts) {
    let q = this.models.CatalogSpecSchema.findOne({
      taxonomyNodeId: categoryId,
      ...this.tq(),
    }).sort({ updatedAt: -1 });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async listForCategory(categoryId: Types.ObjectId, opts?: ExecOpts) {
    let q = this.models.CatalogSpecSchema.find({ taxonomyNodeId: categoryId, ...this.tq() }).sort({
      version: -1,
    });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async create(
    data: {
      taxonomyNodeId: Types.ObjectId;
      familySummary: string;
      status?: string;
    },
    opts?: ExecOpts,
  ) {
    const doc = {
      tenantId: this.tenantId,
      taxonomyNodeId: data.taxonomyNodeId,
      familySummary: data.familySummary,
      status: data.status ?? "draft",
      version: 1,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.CatalogSpecSchema.create([doc], { session: opts.session });
      return created[0];
    }
    return this.models.CatalogSpecSchema.create(doc);
  }

  async updateById(
    id: Types.ObjectId,
    patch: Partial<{
      familySummary: string;
      status: string;
      version: number;
      publishedAt: Date | null;
    }>,
    opts?: ExecOpts,
  ) {
    const upd = buildAuditedUpdate(patch as Record<string, unknown>, opts?.actorId);
    return this.models.CatalogSpecSchema
      .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async deleteById(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.CatalogSpecSchema
      .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
      .exec();
  }
}

import type { Types, ClientSession } from "mongoose";
import type { CategoryCompositionDocument } from "@factorypeer/catalog-models";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { escapeRegex, tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export class CategoryCompositionRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async findById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CategoryComposition.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findByCategoryId(categoryId: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CategoryComposition.findOne({
      categoryId,
      ...this.tq(),
    });
    return withSession(q, opts?.session).exec();
  }

  async findBySlugPath(slugPath: string, opts?: ExecOpts) {
    const q = this.models.CategoryComposition.findOne({
      slugPath,
      ...this.tq(),
    });
    return withSession(q, opts?.session).exec();
  }

  async listByStatus(status: string, opts?: ExecOpts) {
    const q = this.models.CategoryComposition.find({
      status,
      ...this.tq(),
    }).sort({ updatedAt: -1 });
    return withSession(q, opts?.session).exec();
  }

  async listAll(opts?: ExecOpts) {
    const q = this.models.CategoryComposition.find({ ...this.tq() }).sort({ updatedAt: -1 });
    return withSession(q, opts?.session).exec();
  }

  async create(
    data: Omit<CategoryCompositionDocument, "_id" | "createdAt" | "updatedAt" | "documentVersion">,
    opts?: ExecOpts,
  ) {
    const auditFields = auditCreateFields(opts?.actorId);
    const docData = {
      ...data,
      ...auditFields,
      documentVersion: 1,
    };
    if (opts?.session) {
      const created = await this.models.CategoryComposition.create([docData], { session: opts.session });
      return created[0];
    }
    return this.models.CategoryComposition.create(docData);
  }

  async updateFields(
    id: Types.ObjectId,
    updates: Partial<CategoryCompositionDocument>,
    opts?: ExecOpts,
  ) {
    const auditedUpdate = buildAuditedUpdate(updates, opts?.actorId);
    const q = this.models.CategoryComposition.findOneAndUpdate(
      { _id: id, ...this.tq() },
      auditedUpdate,
      { new: true },
    );
    return withSession(q, opts?.session).exec();
  }

  async incrementDocumentVersion(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CategoryComposition.findOneAndUpdate(
      { _id: id, ...this.tq() },
      {
        $inc: { documentVersion: 1 },
        updatedBy: opts?.actorId ?? null,
        updatedAt: new Date(),
      },
      { new: true },
    );
    return withSession(q, opts?.session).exec();
  }

  async delete(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CategoryComposition.deleteOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async publishComposition(id: Types.ObjectId, opts?: ExecOpts) {
    const now = new Date();
    const q = this.models.CategoryComposition.findOneAndUpdate(
      { _id: id, ...this.tq() },
      {
        status: "published",
        publishedAt: now,
        updatedBy: opts?.actorId ?? null,
        updatedAt: now,
        $inc: { documentVersion: 1 },
      },
      { new: true },
    );
    return withSession(q, opts?.session).exec();
  }

  async archiveComposition(id: Types.ObjectId, opts?: ExecOpts) {
    const now = new Date();
    const q = this.models.CategoryComposition.findOneAndUpdate(
      { _id: id, ...this.tq() },
      {
        status: "archived",
        updatedBy: opts?.actorId ?? null,
        updatedAt: now,
        $inc: { documentVersion: 1 },
      },
      { new: true },
    );
    return withSession(q, opts?.session).exec();
  }
}

import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class SpecSchemaRepository {
    models;
    tenantId;
    constructor(models, tenantId) {
        this.models = models;
        this.tenantId = tenantId;
    }
    tq() {
        return tenantMatch(this.tenantId);
    }
    async findById(id, opts) {
        const q = this.models.CatalogSpecSchema.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findActiveOrLatestForCategory(categoryId, opts) {
        let q = this.models.CatalogSpecSchema.findOne({
            taxonomyNodeId: categoryId,
            ...this.tq(),
        }).sort({ updatedAt: -1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async listForCategory(categoryId, opts) {
        let q = this.models.CatalogSpecSchema.find({ taxonomyNodeId: categoryId, ...this.tq() }).sort({
            version: -1,
        });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async create(data, opts) {
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
    async updateById(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.CatalogSpecSchema
            .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        })
            .exec();
    }
    async deleteById(id, opts) {
        return this.models.CatalogSpecSchema
            .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
            .exec();
    }
}

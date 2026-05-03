import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class SpecColumnRepository {
    models;
    tenantId;
    constructor(models, tenantId) {
        this.models = models;
        this.tenantId = tenantId;
    }
    tq() {
        return tenantMatch(this.tenantId);
    }
    async listBySpecSchema(specSchemaId, opts) {
        let q = this.models.CatalogSpecColumn.find({ specSchemaId, ...this.tq() }).sort({
            sortOrder: 1,
            key: 1,
        });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findById(id, opts) {
        const q = this.models.CatalogSpecColumn.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async create(data, opts) {
        const doc = {
            tenantId: this.tenantId,
            specSchemaId: data.specSchemaId,
            key: data.key,
            label: data.label,
            dataType: data.dataType ?? "string",
            filterable: data.filterable ?? false,
            sortable: data.sortable ?? false,
            searchIndex: data.searchIndex ?? false,
            enumOptions: data.enumOptions,
            unit: data.unit,
            widthClass: data.widthClass,
            sortOrder: data.sortOrder ?? 0,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.CatalogSpecColumn.create([doc], { session: opts.session });
            return created[0];
        }
        return this.models.CatalogSpecColumn.create(doc);
    }
    async updateById(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.CatalogSpecColumn
            .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        })
            .exec();
    }
    async deleteById(id, opts) {
        return this.models.CatalogSpecColumn
            .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
            .exec();
    }
    async deleteBySpecSchema(specSchemaId, opts) {
        await this.models.CatalogSpecColumn.deleteMany({ specSchemaId, ...this.tq() }, { session: opts?.session }).exec();
    }
}

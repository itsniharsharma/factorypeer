import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class ProductVariantRepository {
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
        const q = this.models.ProductVariant.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async listByProduct(productId, opts) {
        const filter = { productId, ...this.tq() };
        if (opts?.status)
            filter["status"] = opts.status;
        if (opts?.q?.trim()) {
            const rx = new RegExp(escapeRegex(opts.q.trim()), "i");
            filter["$or"] = [{ sku: rx }, { itemNumber: rx }, { mpn: rx }];
        }
        let q = this.models.ProductVariant.find(filter).sort({ sortOrder: 1, sku: 1 });
        if (opts?.skip != null)
            q = q.skip(opts.skip);
        if (opts?.limit != null)
            q = q.limit(opts.limit);
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async countByProduct(productId, opts) {
        const filter = { productId, ...this.tq() };
        if (opts?.status)
            filter["status"] = opts.status;
        if (opts?.q?.trim()) {
            const rx = new RegExp(escapeRegex(opts.q.trim()), "i");
            filter["$or"] = [{ sku: rx }, { itemNumber: rx }, { mpn: rx }];
        }
        let q = this.models.ProductVariant.countDocuments(filter);
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async create(data, opts) {
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
    async updateById(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.ProductVariant
            .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        })
            .exec();
    }
    async deleteById(id, opts) {
        return this.models.ProductVariant
            .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
            .exec();
    }
    async deleteByProduct(productId, opts) {
        await this.models.ProductVariant.deleteMany({ productId, ...this.tq() }, { session: opts?.session }).exec();
    }
    async clearSpecRowLink(specRowId, opts) {
        await this.models.ProductVariant.updateMany({ specRowId, ...this.tq() }, {
            $set: { specRowId: null, ...(opts?.actorId ? { updatedBy: opts.actorId } : {}) },
            $inc: { documentVersion: 1 },
        }, { session: opts?.session }).exec();
    }
}
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

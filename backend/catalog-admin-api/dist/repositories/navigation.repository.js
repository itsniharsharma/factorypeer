import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class NavigationRepository {
    models;
    tenantId;
    constructor(models, tenantId) {
        this.models = models;
        this.tenantId = tenantId;
    }
    tq() {
        return tenantMatch(this.tenantId);
    }
    async listLinkGroups(opts) {
        const base = {
            ...this.tq(),
            ...(opts?.placement ? { placement: opts.placement } : {}),
            ...(opts?.status ? { status: opts.status } : {}),
        };
        let q = this.models.SiteLinkGroup.find(base).sort({ sortOrder: 1, title: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findLinkGroupById(id, opts) {
        const q = this.models.SiteLinkGroup.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findLinkGroupBySlug(slug, placement, opts) {
        const q = this.models.SiteLinkGroup.findOne({ slug, placement, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async createLinkGroup(doc, opts) {
        const payload = {
            tenantId: this.tenantId,
            ...doc,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.SiteLinkGroup.create([payload], { session: opts.session });
            return created[0];
        }
        return this.models.SiteLinkGroup.create(payload);
    }
    async updateLinkGroup(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.SiteLinkGroup.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        }).exec();
    }
    async deleteLinkGroup(id, opts) {
        return this.models.SiteLinkGroup.findOneAndDelete({ _id: id, ...this.tq() }, {
            session: opts?.session,
        }).exec();
    }
    async listFooterContents(opts) {
        const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
        let q = this.models.FooterContent.find(base).sort({ sortOrder: 1, brandName: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findFooterContentById(id, opts) {
        const q = this.models.FooterContent.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findFooterContentBySlug(slug, opts) {
        const q = this.models.FooterContent.findOne({ slug, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async createFooterContent(doc, opts) {
        const payload = {
            tenantId: this.tenantId,
            ...doc,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.FooterContent.create([payload], { session: opts.session });
            return created[0];
        }
        return this.models.FooterContent.create(payload);
    }
    async updateFooterContent(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.FooterContent.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        }).exec();
    }
    async deleteFooterContent(id, opts) {
        return this.models.FooterContent.findOneAndDelete({ _id: id, ...this.tq() }, {
            session: opts?.session,
        }).exec();
    }
}
export default NavigationRepository;

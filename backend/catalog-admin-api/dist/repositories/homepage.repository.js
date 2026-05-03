import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class HomepageRepository {
    models;
    tenantId;
    constructor(models, tenantId) {
        this.models = models;
        this.tenantId = tenantId;
    }
    tq() {
        return tenantMatch(this.tenantId);
    }
    async listBanners(opts) {
        const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
        let q = this.models.HomepagePromoBanner.find(base).sort({ sortOrder: 1, title: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findBannerById(id, opts) {
        const q = this.models.HomepagePromoBanner.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findBannerBySlug(slug, opts) {
        const q = this.models.HomepagePromoBanner.findOne({ slug, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async createBanner(doc, opts) {
        const payload = {
            tenantId: this.tenantId,
            ...doc,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.HomepagePromoBanner.create([payload], { session: opts.session });
            return created[0];
        }
        return this.models.HomepagePromoBanner.create(payload);
    }
    async updateBanner(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.HomepagePromoBanner.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        }).exec();
    }
    async deleteBanner(id, opts) {
        return this.models.HomepagePromoBanner.findOneAndDelete({ _id: id, ...this.tq() }, {
            session: opts?.session,
        }).exec();
    }
    async listCategoryTiles(opts) {
        const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
        let q = this.models.HomepageCategoryTile.find(base).sort({ sortOrder: 1, label: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findCategoryTileById(id, opts) {
        const q = this.models.HomepageCategoryTile.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findCategoryTileBySlug(slug, opts) {
        const q = this.models.HomepageCategoryTile.findOne({ slug, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async createCategoryTile(doc, opts) {
        const payload = {
            tenantId: this.tenantId,
            ...doc,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.HomepageCategoryTile.create([payload], { session: opts.session });
            return created[0];
        }
        return this.models.HomepageCategoryTile.create(payload);
    }
    async updateCategoryTile(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.HomepageCategoryTile.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        }).exec();
    }
    async deleteCategoryTile(id, opts) {
        return this.models.HomepageCategoryTile.findOneAndDelete({ _id: id, ...this.tq() }, {
            session: opts?.session,
        }).exec();
    }
    async listSupportCards(opts) {
        const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
        let q = this.models.HomepageSupportCard.find(base).sort({ sortOrder: 1, title: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findSupportCardById(id, opts) {
        const q = this.models.HomepageSupportCard.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findSupportCardBySlug(slug, opts) {
        const q = this.models.HomepageSupportCard.findOne({ slug, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async createSupportCard(doc, opts) {
        const payload = {
            tenantId: this.tenantId,
            ...doc,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.HomepageSupportCard.create([payload], { session: opts.session });
            return created[0];
        }
        return this.models.HomepageSupportCard.create(payload);
    }
    async updateSupportCard(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.HomepageSupportCard.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        }).exec();
    }
    async deleteSupportCard(id, opts) {
        return this.models.HomepageSupportCard.findOneAndDelete({ _id: id, ...this.tq() }, {
            session: opts?.session,
        }).exec();
    }
}
export default HomepageRepository;

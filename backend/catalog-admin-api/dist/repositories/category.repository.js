import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { escapeRegex, tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class CategoryRepository {
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
        const q = this.models.CatalogCategory.findOne({ _id: id, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async findByPath(path, opts) {
        const q = this.models.CatalogCategory.findOne({ path, ...this.tq() });
        return withSession(q, opts?.session).exec();
    }
    async listChildren(parentId, sort = "sortOrder", opts) {
        const base = parentId === null
            ? { parentId: null, ...this.tq() }
            : { parentId, ...this.tq() };
        const filter = opts?.status ? { ...base, status: opts.status } : base;
        let q = this.models.CatalogCategory.find(filter).sort({ [sort]: 1, title: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async countDirectChildren(parentId, opts) {
        const q = parentId === null
            ? { parentId: null, ...this.tq() }
            : { parentId, ...this.tq() };
        return withSession(this.models.CatalogCategory.countDocuments(q), opts?.session).exec();
    }
    async slugExistsAmongSiblings(parentId, slug, excludeId, opts) {
        const base = parentId === null
            ? { parentId: null, slug, ...this.tq() }
            : { parentId, slug, ...this.tq() };
        const q = excludeId ? { ...base, _id: { $ne: excludeId } } : base;
        const n = await withSession(this.models.CatalogCategory.countDocuments(q), opts?.session).exec();
        return n > 0;
    }
    async create(data, opts) {
        const doc = {
            tenantId: this.tenantId,
            parentId: data.parentId,
            path: data.path,
            slug: data.slug,
            title: data.title,
            description: data.description,
            landingImage: data.landingImage,
            kind: data.kind,
            status: data.status ?? "draft",
            sortOrder: data.sortOrder ?? 0,
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.CatalogCategory.create([doc], { session: opts.session });
            return created[0];
        }
        return this.models.CatalogCategory.create(doc);
    }
    async updateById(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.CatalogCategory
            .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        })
            .exec();
    }
    async deleteById(id, opts) {
        return this.models.CatalogCategory
            .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
            .exec();
    }
    async findDescendantsByPathPrefix(prefix, opts) {
        const rx = new RegExp(`^${escapeRegex(prefix)}/`);
        let q = this.models.CatalogCategory.find({ path: rx, ...this.tq() }).sort({ path: 1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async findSelfAndDescendants(rootPath, opts) {
        const escaped = escapeRegex(rootPath);
        let q = this.models.CatalogCategory.find({
            $or: [{ path: rootPath }, { path: new RegExp(`^${escaped}/`) }],
            ...this.tq(),
        }).sort({ path: -1 });
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async setSortOrders(pairs, opts) {
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
        if (bulk.length === 0)
            return;
        await this.models.CatalogCategory.bulkWrite(bulk, { session: opts?.session });
    }
    async rewriteSubtreePaths(oldRootPath, newRootPath, opts) {
        const docs = await this.findSelfAndDescendants(oldRootPath, opts);
        const bulk = docs.map((doc) => {
            const p = doc.path;
            const np = p === oldRootPath ? newRootPath : newRootPath + p.slice(oldRootPath.length);
            return {
                updateOne: {
                    filter: { _id: doc._id, ...this.tq() },
                    update: {
                        $set: {
                            path: np,
                            ...(opts?.actorId ? { updatedBy: opts.actorId } : {}),
                        },
                        $inc: { documentVersion: 1 },
                    },
                },
            };
        });
        if (bulk.length === 0)
            return;
        await this.models.CatalogCategory.bulkWrite(bulk, { session: opts?.session });
    }
}

import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { escapeRegex, tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
export class ProductRepository {
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
        const q = this.models.Product.findOne({ _id: id, ...this.tq() });
        const select = opts.select;
        if (select) {
            q.select(select);
        }
        return withSession(q, opts?.session).exec();
    }
    /** Batch load by id (storefront spec matrix — avoids N product lookups). */
    async findByIds(ids, opts) {
        if (!ids.length)
            return [];
        const q = this.models.Product.find({ _id: { $in: ids }, ...this.tq() });
        const select = opts.select;
        if (select) {
            q.select(select);
        }
        return withSession(q, opts?.session).exec();
    }
    async findBySlug(slug, opts) {
        const q = this.models.Product.findOne({ slug, ...this.tq() });
        const select = opts.select;
        if (select) {
            q.select(select);
        }
        return withSession(q, opts?.session).exec();
    }
    /**
     * Product list search: title, slug, searchText, and any variant with matching sku / itemNumber / mpn.
     */
    async buildListFilter(filter, opts) {
        const mongoFilter = { ...this.tq() };
        if (filter?.status)
            mongoFilter["status"] = filter.status;
        if (filter?.ids && filter.ids.length > 0) {
            mongoFilter["_id"] = { $in: filter.ids };
            return mongoFilter;
        }
        if (filter?.categoryId)
            mongoFilter["categoryIds"] = filter.categoryId;
        if (!filter?.q?.trim()) {
            return mongoFilter;
        }
        const q = filter.q.trim();
        const rx = new RegExp(escapeRegex(q), "i");
        let vq = this.models.ProductVariant.find({
            ...this.tq(),
            $or: [{ sku: rx }, { itemNumber: rx }, { mpn: rx }],
        }).select("productId");
        vq = opts?.session ? vq.session(opts.session) : vq;
        const variantRows = await vq.lean().exec();
        const variantPids = [
            ...new Set(variantRows.map((r) => r.productId).filter((id) => id != null)),
        ];
        const orClause = [
            { title: rx },
            { slug: rx },
            { searchText: rx },
        ];
        if (variantPids.length > 0) {
            orClause.push({ _id: { $in: variantPids } });
        }
        mongoFilter["$or"] = orClause;
        return mongoFilter;
    }
    async list(skip = 0, limit = 100, filter, opts) {
        const mongoFilter = await this.buildListFilter(filter, opts);
        const sort = sortFromFilter(filter?.sort);
        let q = this.models.Product.find(mongoFilter).sort(sort).skip(skip).limit(limit);
        const select = opts.select;
        if (select) {
            q.select(select);
        }
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async count(filter, opts) {
        const mongoFilter = await this.buildListFilter(filter, opts);
        let q = this.models.Product.countDocuments(mongoFilter);
        q = withSession(q, opts?.session);
        return q.exec();
    }
    async create(data, opts) {
        const doc = {
            tenantId: this.tenantId,
            slug: data.slug,
            title: data.title,
            brand: data.brand,
            status: data.status ?? "draft",
            categoryIds: data.categoryIds ?? [],
            searchText: data.searchText ?? "",
            sortOrder: data.sortOrder ?? 0,
            media: data.media ?? [],
            longDescription: data.longDescription ?? "",
            features: data.features ?? [],
            applications: data.applications ?? [],
            marketingBullets: data.marketingBullets ?? [],
            attachments: data.attachments ?? [],
            relatedProductIds: data.relatedProductIds ?? [],
            compatibleProductIds: data.compatibleProductIds ?? [],
            recommendedProductIds: data.recommendedProductIds ?? [],
            shippingWeight: data.shippingWeight,
            branchAvailabilityPlaceholder: data.branchAvailabilityPlaceholder,
            logisticsMeta: data.logisticsMeta ?? [],
            documentVersion: 1,
            ...auditCreateFields(opts?.actorId),
        };
        if (opts?.session) {
            const created = await this.models.Product.create([doc], { session: opts.session });
            return created[0];
        }
        return this.models.Product.create(doc);
    }
    async updateById(id, patch, opts) {
        const upd = buildAuditedUpdate(patch, opts?.actorId);
        return this.models.Product
            .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
            new: true,
            session: opts?.session,
        })
            .exec();
    }
    async deleteById(id, opts) {
        return this.models.Product
            .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
            .exec();
    }
}
function sortFromFilter(sort) {
    switch (sort) {
        case "-title":
            return { title: -1 };
        case "updatedAt":
            return { updatedAt: 1 };
        case "-updatedAt":
            return { updatedAt: -1 };
        case "sortOrder":
            return { sortOrder: 1, title: 1 };
        case "title":
        default:
            return { sortOrder: 1, title: 1 };
    }
}

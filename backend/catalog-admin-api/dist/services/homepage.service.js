import { ConflictError } from "../errors/app-error.js";
import { CatalogErrorCodes, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
function publishedAtFor(status) {
    return status === "published" ? new Date() : undefined;
}
function recordAlreadyExists(slug, context) {
    return new ConflictError(`The ${context} slug "${slug}" is already in use. Choose a different slug.`, CatalogErrorCodes.CONFLICT);
}
export class HomepageService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async listBanners(ctx, status) {
        return this.repo.listBanners({ actorId: ctx?.actorUserId ?? undefined, status });
    }
    async getBanner(id, ctx) {
        const doc = await this.repo.findBannerById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc)
            throw resourceNotFound("HomepagePromoBanner", id);
        return doc;
    }
    async createBanner(body, ctx) {
        const existing = await this.repo.findBannerBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
        if (existing)
            throw recordAlreadyExists(body.slug, "homepage banner");
        return this.repo.createBanner({
            ...body,
            publishedAt: publishedAtFor(body.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async updateBanner(id, patch, ctx) {
        const oid = toObjectId(id);
        const current = await this.repo.findBannerById(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (!current)
            throw resourceNotFound("HomepagePromoBanner", id);
        if (patch.slug && patch.slug !== current.slug) {
            const existing = await this.repo.findBannerBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
            if (existing && !existing._id.equals(oid))
                throw recordAlreadyExists(patch.slug, "homepage banner");
        }
        return this.repo.updateBanner(oid, {
            ...patch,
            publishedAt: publishedAtFor(patch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async deleteBanner(id, ctx) {
        return this.repo.deleteBanner(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    }
    async listCategoryTiles(ctx, status) {
        return this.repo.listCategoryTiles({ actorId: ctx?.actorUserId ?? undefined, status });
    }
    async getCategoryTile(id, ctx) {
        const doc = await this.repo.findCategoryTileById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc)
            throw resourceNotFound("HomepageCategoryTile", id);
        return doc;
    }
    async createCategoryTile(body, ctx) {
        const existing = await this.repo.findCategoryTileBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
        if (existing)
            throw recordAlreadyExists(body.slug, "homepage tile");
        return this.repo.createCategoryTile({
            ...body,
            categoryId: body.categoryId ? toObjectId(body.categoryId) : null,
            publishedAt: publishedAtFor(body.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async updateCategoryTile(id, patch, ctx) {
        const oid = toObjectId(id);
        const current = await this.repo.findCategoryTileById(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (!current)
            throw resourceNotFound("HomepageCategoryTile", id);
        if (patch.slug && patch.slug !== current.slug) {
            const existing = await this.repo.findCategoryTileBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
            if (existing && !existing._id.equals(oid))
                throw recordAlreadyExists(patch.slug, "homepage tile");
        }
        return this.repo.updateCategoryTile(oid, {
            ...patch,
            categoryId: patch.categoryId === undefined
                ? undefined
                : patch.categoryId
                    ? toObjectId(patch.categoryId)
                    : null,
            publishedAt: publishedAtFor(patch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async deleteCategoryTile(id, ctx) {
        return this.repo.deleteCategoryTile(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    }
    async listSupportCards(ctx, status) {
        return this.repo.listSupportCards({ actorId: ctx?.actorUserId ?? undefined, status });
    }
    async getSupportCard(id, ctx) {
        const doc = await this.repo.findSupportCardById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc)
            throw resourceNotFound("HomepageSupportCard", id);
        return doc;
    }
    async createSupportCard(body, ctx) {
        const existing = await this.repo.findSupportCardBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
        if (existing)
            throw recordAlreadyExists(body.slug, "homepage support card");
        return this.repo.createSupportCard({
            ...body,
            publishedAt: publishedAtFor(body.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async updateSupportCard(id, patch, ctx) {
        const oid = toObjectId(id);
        const current = await this.repo.findSupportCardById(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (!current)
            throw resourceNotFound("HomepageSupportCard", id);
        if (patch.slug && patch.slug !== current.slug) {
            const existing = await this.repo.findSupportCardBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
            if (existing && !existing._id.equals(oid))
                throw recordAlreadyExists(patch.slug, "homepage support card");
        }
        return this.repo.updateSupportCard(oid, {
            ...patch,
            publishedAt: publishedAtFor(patch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async deleteSupportCard(id, ctx) {
        return this.repo.deleteSupportCard(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    }
}
export default HomepageService;

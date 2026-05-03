import { ConflictError, AppError } from "../errors/app-error.js";
import { CatalogErrorCodes, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import { normalizeHomepageImagePayload, resolveHomepageImageMerge, } from "../utils/homepage-image-normalize.js";
function publishedAtFor(status) {
    return status === "published" ? new Date() : undefined;
}
function recordAlreadyExists(slug, context) {
    return new ConflictError(`The ${context} slug "${slug}" is already in use. Choose a different slug.`, CatalogErrorCodes.CONFLICT);
}
function plainBannerLike(doc) {
    const d = doc;
    const o = typeof d.toObject === "function" ? d.toObject() : doc;
    return o;
}
export class HomepageService {
    repo;
    cloudinary;
    constructor(repo, cloudinary) {
        this.repo = repo;
        this.cloudinary = cloudinary;
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
        const norm = normalizeHomepageImagePayload(body);
        if (!norm) {
            throw new AppError("Banner requires `image.url`.", 400, CatalogErrorCodes.VALIDATION_ERROR);
        }
        return this.repo.createBanner({
            ...body,
            ...norm,
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
        const cur = plainBannerLike(current);
        const merged = patch.image !== undefined || patch.imageAlt !== undefined
            ? resolveHomepageImageMerge(cur, patch)
            : undefined;
        const nextPatch = merged ? { ...patch, ...merged } : patch;
        const oldPid = cur.image?.publicId;
        const updated = await this.repo.updateBanner(oid, {
            ...nextPatch,
            publishedAt: publishedAtFor(nextPatch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
        const newPid = updated?.image?.publicId;
        if (oldPid && newPid && oldPid !== newPid)
            await this.cloudinary.destroy(oldPid);
        return updated;
    }
    async deleteBanner(id, ctx) {
        const oid = toObjectId(id);
        const cur = await this.repo.findBannerById(oid, { actorId: ctx?.actorUserId ?? undefined });
        const pid = cur?.image?.publicId;
        const deleted = await this.repo.deleteBanner(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (pid)
            await this.cloudinary.destroy(pid);
        return deleted;
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
        const norm = normalizeHomepageImagePayload(body);
        if (!norm) {
            throw new AppError("Category tile requires `image.url`.", 400, CatalogErrorCodes.VALIDATION_ERROR);
        }
        return this.repo.createCategoryTile({
            ...body,
            ...norm,
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
        const cur = plainBannerLike(current);
        const merged = patch.image !== undefined || patch.imageAlt !== undefined
            ? resolveHomepageImageMerge(cur, patch)
            : undefined;
        const nextPatch = merged ? { ...patch, ...merged } : patch;
        const oldPid = cur.image?.publicId;
        const updated = await this.repo.updateCategoryTile(oid, {
            ...nextPatch,
            categoryId: nextPatch.categoryId === undefined
                ? undefined
                : nextPatch.categoryId
                    ? toObjectId(nextPatch.categoryId)
                    : null,
            publishedAt: publishedAtFor(nextPatch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
        const newPid = updated?.image?.publicId;
        if (oldPid && newPid && oldPid !== newPid)
            await this.cloudinary.destroy(oldPid);
        return updated;
    }
    async deleteCategoryTile(id, ctx) {
        const oid = toObjectId(id);
        const cur = await this.repo.findCategoryTileById(oid, { actorId: ctx?.actorUserId ?? undefined });
        const pid = cur?.image?.publicId;
        const deleted = await this.repo.deleteCategoryTile(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (pid)
            await this.cloudinary.destroy(pid);
        return deleted;
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
        const norm = body.image?.url ? normalizeHomepageImagePayload({ image: body.image }) : null;
        return this.repo.createSupportCard({
            ...body,
            ...(norm ?? {}),
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
        const cur = plainBannerLike(current);
        let nextPatch = { ...patch };
        if (patch.image !== undefined) {
            if (!patch.image?.url?.trim()) {
                nextPatch = { ...patch, image: undefined };
            }
            else {
                const norm = normalizeHomepageImagePayload({ image: patch.image });
                if (norm)
                    nextPatch = { ...patch, ...norm };
            }
        }
        const oldPid = cur.image?.publicId;
        const updated = await this.repo.updateSupportCard(oid, {
            ...nextPatch,
            publishedAt: publishedAtFor(nextPatch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
        const newPid = updated?.image?.publicId;
        if (oldPid && newPid && oldPid !== newPid)
            await this.cloudinary.destroy(oldPid);
        return updated;
    }
    async deleteSupportCard(id, ctx) {
        const oid = toObjectId(id);
        const cur = await this.repo.findSupportCardById(oid, { actorId: ctx?.actorUserId ?? undefined });
        const pid = cur?.image?.publicId;
        const deleted = await this.repo.deleteSupportCard(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (pid)
            await this.cloudinary.destroy(pid);
        return deleted;
    }
}
export default HomepageService;

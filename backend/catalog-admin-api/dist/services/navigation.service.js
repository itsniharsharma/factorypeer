import { ConflictError } from "../errors/app-error.js";
import { CatalogErrorCodes, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
function publishedAtFor(status) {
    return status === "published" ? new Date() : undefined;
}
function recordAlreadyExists(slug, context) {
    return new ConflictError(`The ${context} slug "${slug}" is already in use. Choose a different slug.`, CatalogErrorCodes.CONFLICT);
}
export class NavigationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async listLinkGroups(ctx, placement, status) {
        return this.repo.listLinkGroups({ actorId: ctx?.actorUserId ?? undefined, placement, status });
    }
    async getLinkGroup(id, ctx) {
        const doc = await this.repo.findLinkGroupById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc)
            throw resourceNotFound("SiteLinkGroup", id);
        return doc;
    }
    async createLinkGroup(body, ctx) {
        const existing = await this.repo.findLinkGroupBySlug(body.slug, body.placement, {
            actorId: ctx?.actorUserId ?? undefined,
        });
        if (existing)
            throw recordAlreadyExists(body.slug, `${body.placement} link group`);
        return this.repo.createLinkGroup({
            ...body,
            links: body.links ?? [],
            publishedAt: publishedAtFor(body.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async updateLinkGroup(id, patch, ctx) {
        const oid = toObjectId(id);
        const current = await this.repo.findLinkGroupById(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (!current)
            throw resourceNotFound("SiteLinkGroup", id);
        const placement = patch.placement ?? current.placement;
        if (patch.slug && patch.slug !== current.slug) {
            const existing = await this.repo.findLinkGroupBySlug(patch.slug, placement, {
                actorId: ctx?.actorUserId ?? undefined,
            });
            if (existing && !existing._id.equals(oid))
                throw recordAlreadyExists(patch.slug, `${placement} link group`);
        }
        return this.repo.updateLinkGroup(oid, {
            ...patch,
            publishedAt: publishedAtFor(patch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async deleteLinkGroup(id, ctx) {
        return this.repo.deleteLinkGroup(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    }
    async listFooterContents(ctx, status) {
        return this.repo.listFooterContents({ actorId: ctx?.actorUserId ?? undefined, status });
    }
    async getFooterContent(id, ctx) {
        const doc = await this.repo.findFooterContentById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc)
            throw resourceNotFound("FooterContent", id);
        return doc;
    }
    async createFooterContent(body, ctx) {
        const existing = await this.repo.findFooterContentBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
        if (existing)
            throw recordAlreadyExists(body.slug, "footer content");
        return this.repo.createFooterContent({
            ...body,
            socialLinks: body.socialLinks ?? [],
            publishedAt: publishedAtFor(body.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async updateFooterContent(id, patch, ctx) {
        const oid = toObjectId(id);
        const current = await this.repo.findFooterContentById(oid, { actorId: ctx?.actorUserId ?? undefined });
        if (!current)
            throw resourceNotFound("FooterContent", id);
        if (patch.slug && patch.slug !== current.slug) {
            const existing = await this.repo.findFooterContentBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
            if (existing && !existing._id.equals(oid))
                throw recordAlreadyExists(patch.slug, "footer content");
        }
        return this.repo.updateFooterContent(oid, {
            ...patch,
            publishedAt: publishedAtFor(patch.status),
        }, { actorId: ctx?.actorUserId ?? undefined });
    }
    async deleteFooterContent(id, ctx) {
        return this.repo.deleteFooterContent(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    }
}
export default NavigationService;

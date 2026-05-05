import { ConflictError } from "../errors/app-error.js";
import { CatalogErrorCodes, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";
import { NavigationRepository } from "../repositories/navigation.repository.js";
import { invalidateCatalogCache } from "../utils/cache.js";
import { adminCacheAside } from "../utils/admin-cache.js";

function publishedAtFor(status?: string) {
  return status === "published" ? new Date() : undefined;
}

function recordAlreadyExists(slug: string, context: string) {
  return new ConflictError(
    `The ${context} slug "${slug}" is already in use. Choose a different slug.`,
    CatalogErrorCodes.CONFLICT,
  );
}

export class NavigationService {
  constructor(private readonly repo: NavigationRepository) {}

  async listLinkGroups(ctx?: WriteContext, placement?: string, status?: string) {
    return adminCacheAside({
      scope: "navigation",
      key: `link-groups:${placement ?? "all"}:${status ?? "any"}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () =>
        this.repo.listLinkGroups({ actorId: ctx?.actorUserId ?? undefined, placement, status }),
    });
  }

  async getLinkGroup(id: string, ctx?: WriteContext) {
    return adminCacheAside({
      scope: "navigation",
      key: `link-group:${id}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const doc = await this.repo.findLinkGroupById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc) throw resourceNotFound("SiteLinkGroup", id);
        return doc;
      },
    });
  }

  async createLinkGroup(body: {
    slug: string;
    title: string;
    placement: "utility" | "navigation" | "footer";
    description?: string;
    status?: string;
    sortOrder?: number;
    links?: Array<Record<string, unknown>>;
    metadata?: Record<string, unknown>;
  }, ctx?: WriteContext) {
    const existing = await this.repo.findLinkGroupBySlug(body.slug, body.placement, {
      actorId: ctx?.actorUserId ?? undefined,
    });
    if (existing) throw recordAlreadyExists(body.slug, `${body.placement} link group`);
    const created = await this.repo.createLinkGroup(
      {
        ...body,
        links: body.links ?? [],
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["navigation", "homepage"]);
    return created;
  }

  async updateLinkGroup(
    id: string,
    patch: Partial<{
      slug: string;
      title: string;
      placement: "utility" | "navigation" | "footer";
      description: string;
      status: string;
      sortOrder: number;
      links: Array<Record<string, unknown>>;
      metadata: Record<string, unknown>;
    }>,
    ctx?: WriteContext,
  ) {
    const oid = toObjectId(id);
    const current = await this.repo.findLinkGroupById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("SiteLinkGroup", id);
    const placement = patch.placement ?? (current.placement as "utility" | "navigation" | "footer");
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findLinkGroupBySlug(patch.slug, placement, {
        actorId: ctx?.actorUserId ?? undefined,
      });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, `${placement} link group`);
    }
    const updated = await this.repo.updateLinkGroup(
      oid,
      {
        ...patch,
        publishedAt: publishedAtFor(patch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["navigation", "homepage"]);
    return updated;
  }

  async deleteLinkGroup(id: string, ctx?: WriteContext) {
    const deleted = await this.repo.deleteLinkGroup(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    await invalidateCatalogCache(["navigation", "homepage"]);
    return deleted;
  }

  async listFooterContents(ctx?: WriteContext, status?: string) {
    return adminCacheAside({
      scope: "navigation",
      key: `footer-content:${status ?? "any"}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => this.repo.listFooterContents({ actorId: ctx?.actorUserId ?? undefined, status }),
    });
  }

  async getFooterContent(id: string, ctx?: WriteContext) {
    return adminCacheAside({
      scope: "navigation",
      key: `footer-content-by-id:${id}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const doc = await this.repo.findFooterContentById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
        if (!doc) throw resourceNotFound("FooterContent", id);
        return doc;
      },
    });
  }

  async createFooterContent(body: {
    slug: string;
    brandName?: string;
    newsletterHeading?: string;
    newsletterDescription?: string;
    newsletterCtaLabel?: string;
    newsletterCtaHref?: string;
    feedbackHeading?: string;
    feedbackCtaLabel?: string;
    feedbackCtaHref?: string;
    copyrightText?: string;
    status?: string;
    sortOrder?: number;
    socialLinks?: Array<Record<string, unknown>>;
    metadata?: Record<string, unknown>;
  }, ctx?: WriteContext) {
    const existing = await this.repo.findFooterContentBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "footer content");
    const created = await this.repo.createFooterContent(
      {
        ...body,
        socialLinks: body.socialLinks ?? [],
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["navigation", "homepage"]);
    return created;
  }

  async updateFooterContent(
    id: string,
    patch: Partial<{
      slug: string;
      brandName: string;
      newsletterHeading: string;
      newsletterDescription: string;
      newsletterCtaLabel: string;
      newsletterCtaHref: string;
      feedbackHeading: string;
      feedbackCtaLabel: string;
      feedbackCtaHref: string;
      copyrightText: string;
      status: string;
      sortOrder: number;
      socialLinks: Array<Record<string, unknown>>;
      metadata: Record<string, unknown>;
    }>,
    ctx?: WriteContext,
  ) {
    const oid = toObjectId(id);
    const current = await this.repo.findFooterContentById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("FooterContent", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findFooterContentBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "footer content");
    }
    const updated = await this.repo.updateFooterContent(
      oid,
      {
        ...patch,
        publishedAt: publishedAtFor(patch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["navigation", "homepage"]);
    return updated;
  }

  async deleteFooterContent(id: string, ctx?: WriteContext) {
    const deleted = await this.repo.deleteFooterContent(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    await invalidateCatalogCache(["navigation", "homepage"]);
    return deleted;
  }
}

export default NavigationService;
import { HomepageRepository } from "../repositories/homepage.repository.js";
import { ConflictError, AppError } from "../errors/app-error.js";
import { CatalogErrorCodes, resourceNotFound, slugTaken } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";
import type {
  HomepageCategoryTileDocument,
  HomepagePromoBannerDocument,
  HomepageSupportCardDocument,
} from "@factorypeer/catalog-models";

function publishedAtFor(status?: string) {
  return status === "published" ? new Date() : undefined;
}

function recordAlreadyExists(slug: string, context: string) {
  return new ConflictError(
    `The ${context} slug "${slug}" is already in use. Choose a different slug.`,
    CatalogErrorCodes.CONFLICT,
  );
}

export class HomepageService {
  constructor(private readonly repo: HomepageRepository) {}

  async listBanners(ctx?: WriteContext, status?: string): Promise<HomepagePromoBannerDocument[]> {
    return this.repo.listBanners({ actorId: ctx?.actorUserId ?? undefined, status });
  }

  async getBanner(id: string, ctx?: WriteContext): Promise<HomepagePromoBannerDocument> {
    const doc = await this.repo.findBannerById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    if (!doc) throw resourceNotFound("HomepagePromoBanner", id);
    return doc;
  }

  async createBanner(body: {
    slug: string;
    eyebrow?: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    imageAlt?: string;
    ctaLabel?: string;
    href?: string;
    openInNewTab?: boolean;
    status?: string;
    sortOrder?: number;
    metadata?: Record<string, unknown>;
  }, ctx?: WriteContext): Promise<HomepagePromoBannerDocument> {
    const existing = await this.repo.findBannerBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "homepage banner");
    return this.repo.createBanner(
      {
        ...body,
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
  }

  async updateBanner(id: string, patch: Partial<{
    slug: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
    href: string;
    openInNewTab: boolean;
    status: string;
    sortOrder: number;
    metadata: Record<string, unknown>;
  }>, ctx?: WriteContext): Promise<HomepagePromoBannerDocument | null> {
    const oid = toObjectId(id);
    const current = await this.repo.findBannerById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("HomepagePromoBanner", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findBannerBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "homepage banner");
    }
    return this.repo.updateBanner(
      oid,
      {
        ...patch,
        publishedAt: publishedAtFor(patch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
  }

  async deleteBanner(id: string, ctx?: WriteContext): Promise<HomepagePromoBannerDocument | null> {
    return this.repo.deleteBanner(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
  }

  async listCategoryTiles(ctx?: WriteContext, status?: string): Promise<HomepageCategoryTileDocument[]> {
    return this.repo.listCategoryTiles({ actorId: ctx?.actorUserId ?? undefined, status });
  }

  async getCategoryTile(id: string, ctx?: WriteContext): Promise<HomepageCategoryTileDocument> {
    const doc = await this.repo.findCategoryTileById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    if (!doc) throw resourceNotFound("HomepageCategoryTile", id);
    return doc;
  }

  async createCategoryTile(body: {
    slug: string;
    label: string;
    description?: string;
    categoryId?: string | null;
    href?: string;
    imageUrl: string;
    imageAlt?: string;
    icon?: string;
    ctaLabel?: string;
    status?: string;
    sortOrder?: number;
    metadata?: Record<string, unknown>;
  }, ctx?: WriteContext): Promise<HomepageCategoryTileDocument> {
    const existing = await this.repo.findCategoryTileBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "homepage tile");
    return this.repo.createCategoryTile(
      {
        ...body,
        categoryId: body.categoryId ? toObjectId(body.categoryId) : null,
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
  }

  async updateCategoryTile(id: string, patch: Partial<{
    slug: string;
    label: string;
    description: string;
    categoryId: string | null;
    href: string;
    imageUrl: string;
    imageAlt: string;
    icon: string;
    ctaLabel: string;
    status: string;
    sortOrder: number;
    metadata: Record<string, unknown>;
  }>, ctx?: WriteContext): Promise<HomepageCategoryTileDocument | null> {
    const oid = toObjectId(id);
    const current = await this.repo.findCategoryTileById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("HomepageCategoryTile", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findCategoryTileBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "homepage tile");
    }
    return this.repo.updateCategoryTile(
      oid,
      {
        ...patch,
        categoryId:
          patch.categoryId === undefined
            ? undefined
            : patch.categoryId
              ? toObjectId(patch.categoryId)
              : null,
        publishedAt: publishedAtFor(patch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
  }

  async deleteCategoryTile(id: string, ctx?: WriteContext): Promise<HomepageCategoryTileDocument | null> {
    return this.repo.deleteCategoryTile(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
  }

  async listSupportCards(ctx?: WriteContext, status?: string): Promise<HomepageSupportCardDocument[]> {
    return this.repo.listSupportCards({ actorId: ctx?.actorUserId ?? undefined, status });
  }

  async getSupportCard(id: string, ctx?: WriteContext): Promise<HomepageSupportCardDocument> {
    const doc = await this.repo.findSupportCardById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    if (!doc) throw resourceNotFound("HomepageSupportCard", id);
    return doc;
  }

  async createSupportCard(body: {
    slug: string;
    title: string;
    description?: string;
    icon?: string;
    ctaLabel?: string;
    href?: string;
    status?: string;
    sortOrder?: number;
    metadata?: Record<string, unknown>;
  }, ctx?: WriteContext): Promise<HomepageSupportCardDocument> {
    const existing = await this.repo.findSupportCardBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "homepage support card");
    return this.repo.createSupportCard(
      {
        ...body,
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
  }

  async updateSupportCard(id: string, patch: Partial<{
    slug: string;
    title: string;
    description: string;
    icon: string;
    ctaLabel: string;
    href: string;
    status: string;
    sortOrder: number;
    metadata: Record<string, unknown>;
  }>, ctx?: WriteContext): Promise<HomepageSupportCardDocument | null> {
    const oid = toObjectId(id);
    const current = await this.repo.findSupportCardById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("HomepageSupportCard", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findSupportCardBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "homepage support card");
    }
    return this.repo.updateSupportCard(
      oid,
      {
        ...patch,
        publishedAt: publishedAtFor(patch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
  }

  async deleteSupportCard(id: string, ctx?: WriteContext): Promise<HomepageSupportCardDocument | null> {
    return this.repo.deleteSupportCard(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
  }
}

export default HomepageService;

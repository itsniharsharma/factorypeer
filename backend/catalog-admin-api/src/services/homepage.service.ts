import type {
  HomepageCategoryTileDocument,
  HomepagePromoBannerDocument,
  HomepageSupportCardDocument,
} from "@factorypeer/catalog-models";
import { HomepageRepository } from "../repositories/homepage.repository.js";
import { ConflictError, AppError } from "../errors/app-error.js";
import { CatalogErrorCodes, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";
import {
  normalizeHomepageImagePayload,
  resolveHomepageImageMerge,
  type HomepageImageInput,
} from "../utils/homepage-image-normalize.js";
import type { CloudinaryService } from "./cloudinary.service.js";
import { invalidateCatalogCache } from "../utils/cache.js";

function publishedAtFor(status?: string) {
  return status === "published" ? new Date() : undefined;
}

function recordAlreadyExists(slug: string, context: string) {
  return new ConflictError(
    `The ${context} slug "${slug}" is already in use. Choose a different slug.`,
    CatalogErrorCodes.CONFLICT,
  );
}

type HomepageImgFields = {
  image?: HomepageImageInput["image"];
};

function plainBannerLike(doc: unknown): HomepageImgFields {
  const d = doc as { toObject?: () => HomepageImgFields };
  const o = typeof d.toObject === "function" ? d.toObject() : (doc as HomepageImgFields);
  return o;
}

export class HomepageService {
  constructor(
    private readonly repo: HomepageRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async listBanners(ctx?: WriteContext, status?: string): Promise<HomepagePromoBannerDocument[]> {
    return this.repo.listBanners({ actorId: ctx?.actorUserId ?? undefined, status });
  }

  async getBanner(id: string, ctx?: WriteContext): Promise<HomepagePromoBannerDocument> {
    const doc = await this.repo.findBannerById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    if (!doc) throw resourceNotFound("HomepagePromoBanner", id);
    return doc;
  }

  async createBanner(
    body: {
      slug: string;
      eyebrow?: string;
      title: string;
      subtitle?: string;
      description?: string;
      image?: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      imageAlt?: string;
      ctaLabel?: string;
      href?: string;
      openInNewTab?: boolean;
      status?: string;
      sortOrder?: number;
      metadata?: Record<string, unknown>;
    },
    ctx?: WriteContext,
  ): Promise<HomepagePromoBannerDocument> {
    const existing = await this.repo.findBannerBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "homepage banner");
    const norm = normalizeHomepageImagePayload(body);
    if (!norm) {
      throw new AppError(
        "Banner requires `image.url`.",
        400,
        CatalogErrorCodes.VALIDATION_ERROR,
      );
    }
    const created = await this.repo.createBanner(
      {
        ...body,
        ...norm,
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["homepage"]);
    return created;
  }

  async updateBanner(
    id: string,
    patch: Partial<{
      slug: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      description: string;
      image: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      imageAlt: string;
      ctaLabel: string;
      href: string;
      openInNewTab: boolean;
      status: string;
      sortOrder: number;
      metadata: Record<string, unknown>;
    }>,
    ctx?: WriteContext,
  ): Promise<HomepagePromoBannerDocument | null> {
    const oid = toObjectId(id);
    const current = await this.repo.findBannerById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("HomepagePromoBanner", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findBannerBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "homepage banner");
    }

    const cur = plainBannerLike(current);
    const merged =
      patch.image !== undefined || patch.imageAlt !== undefined
        ? resolveHomepageImageMerge(cur, patch)
        : undefined;
    const nextPatch = merged ? { ...patch, ...merged } : patch;
    const oldPid = cur.image?.publicId;

    const updated = await this.repo.updateBanner(
      oid,
      {
        ...nextPatch,
        publishedAt: publishedAtFor(nextPatch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    const newPid = updated?.image?.publicId;
    if (oldPid && newPid && oldPid !== newPid) await this.cloudinary.destroy(oldPid);
    await invalidateCatalogCache(["homepage"]);
    return updated;
  }

  async deleteBanner(id: string, ctx?: WriteContext): Promise<HomepagePromoBannerDocument | null> {
    const oid = toObjectId(id);
    const cur = await this.repo.findBannerById(oid, { actorId: ctx?.actorUserId ?? undefined });
    const pid = cur?.image?.publicId;
    const deleted = await this.repo.deleteBanner(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (pid) await this.cloudinary.destroy(pid);
    await invalidateCatalogCache(["homepage"]);
    return deleted;
  }

  async listCategoryTiles(ctx?: WriteContext, status?: string): Promise<HomepageCategoryTileDocument[]> {
    return this.repo.listCategoryTiles({ actorId: ctx?.actorUserId ?? undefined, status });
  }

  async getCategoryTile(id: string, ctx?: WriteContext): Promise<HomepageCategoryTileDocument> {
    const doc = await this.repo.findCategoryTileById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    if (!doc) throw resourceNotFound("HomepageCategoryTile", id);
    return doc;
  }

  async createCategoryTile(
    body: {
      slug: string;
      label: string;
      description?: string;
      categoryId?: string | null;
      href?: string;
      image?: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      imageAlt?: string;
      icon?: string;
      ctaLabel?: string;
      status?: string;
      sortOrder?: number;
      metadata?: Record<string, unknown>;
    },
    ctx?: WriteContext,
  ): Promise<HomepageCategoryTileDocument> {
    const existing = await this.repo.findCategoryTileBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "homepage tile");
    const norm = normalizeHomepageImagePayload(body);
    if (!norm) {
      throw new AppError(
        "Category tile requires `image.url`.",
        400,
        CatalogErrorCodes.VALIDATION_ERROR,
      );
    }
    const created = await this.repo.createCategoryTile(
      {
        ...body,
        ...norm,
        categoryId: body.categoryId ? toObjectId(body.categoryId) : null,
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["homepage"]);
    return created;
  }

  async updateCategoryTile(
    id: string,
    patch: Partial<{
      slug: string;
      label: string;
      description: string;
      categoryId: string | null;
      href: string;
      image: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      imageAlt: string;
      icon: string;
      ctaLabel: string;
      status: string;
      sortOrder: number;
      metadata: Record<string, unknown>;
    }>,
    ctx?: WriteContext,
  ): Promise<HomepageCategoryTileDocument | null> {
    const oid = toObjectId(id);
    const current = await this.repo.findCategoryTileById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("HomepageCategoryTile", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findCategoryTileBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "homepage tile");
    }
    const cur = plainBannerLike(current);
    const merged =
      patch.image !== undefined || patch.imageAlt !== undefined
        ? resolveHomepageImageMerge(cur, patch)
        : undefined;
    const nextPatch = merged ? { ...patch, ...merged } : patch;
    const oldPid = cur.image?.publicId;

    const updated = await this.repo.updateCategoryTile(
      oid,
      {
        ...nextPatch,
        categoryId:
          nextPatch.categoryId === undefined
            ? undefined
            : nextPatch.categoryId
              ? toObjectId(nextPatch.categoryId)
              : null,
        publishedAt: publishedAtFor(nextPatch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    const newPid = updated?.image?.publicId;
    if (oldPid && newPid && oldPid !== newPid) await this.cloudinary.destroy(oldPid);
    await invalidateCatalogCache(["homepage"]);
    return updated;
  }

  async deleteCategoryTile(id: string, ctx?: WriteContext): Promise<HomepageCategoryTileDocument | null> {
    const oid = toObjectId(id);
    const cur = await this.repo.findCategoryTileById(oid, { actorId: ctx?.actorUserId ?? undefined });
    const pid = cur?.image?.publicId;
    const deleted = await this.repo.deleteCategoryTile(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (pid) await this.cloudinary.destroy(pid);
    await invalidateCatalogCache(["homepage"]);
    return deleted;
  }

  async listSupportCards(ctx?: WriteContext, status?: string): Promise<HomepageSupportCardDocument[]> {
    return this.repo.listSupportCards({ actorId: ctx?.actorUserId ?? undefined, status });
  }

  async getSupportCard(id: string, ctx?: WriteContext): Promise<HomepageSupportCardDocument> {
    const doc = await this.repo.findSupportCardById(toObjectId(id), { actorId: ctx?.actorUserId ?? undefined });
    if (!doc) throw resourceNotFound("HomepageSupportCard", id);
    return doc;
  }

  async createSupportCard(
    body: {
      slug: string;
      title: string;
      description?: string;
      image?: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      icon?: string;
      ctaLabel?: string;
      href?: string;
      status?: string;
      sortOrder?: number;
      metadata?: Record<string, unknown>;
    },
    ctx?: WriteContext,
  ): Promise<HomepageSupportCardDocument> {
    const existing = await this.repo.findSupportCardBySlug(body.slug, { actorId: ctx?.actorUserId ?? undefined });
    if (existing) throw recordAlreadyExists(body.slug, "homepage support card");
    const norm = body.image?.url ? normalizeHomepageImagePayload({ image: body.image }) : null;
    const created = await this.repo.createSupportCard(
      {
        ...body,
        ...(norm ?? {}),
        publishedAt: publishedAtFor(body.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    await invalidateCatalogCache(["homepage"]);
    return created;
  }

  async updateSupportCard(
    id: string,
    patch: Partial<{
      slug: string;
      title: string;
      description: string;
      image: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      };
      icon: string;
      ctaLabel: string;
      href: string;
      status: string;
      sortOrder: number;
      metadata: Record<string, unknown>;
    }>,
    ctx?: WriteContext,
  ): Promise<HomepageSupportCardDocument | null> {
    const oid = toObjectId(id);
    const current = await this.repo.findSupportCardById(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (!current) throw resourceNotFound("HomepageSupportCard", id);
    if (patch.slug && patch.slug !== current.slug) {
      const existing = await this.repo.findSupportCardBySlug(patch.slug, { actorId: ctx?.actorUserId ?? undefined });
      if (existing && !existing._id.equals(oid)) throw recordAlreadyExists(patch.slug, "homepage support card");
    }
    const cur = plainBannerLike(current);
    let nextPatch: typeof patch = { ...patch };
    if (patch.image !== undefined) {
      if (!patch.image?.url?.trim()) {
        nextPatch = { ...patch, image: undefined };
      } else {
        const norm = normalizeHomepageImagePayload({ image: patch.image });
        if (norm) nextPatch = { ...patch, ...norm };
      }
    }
    const oldPid = cur.image?.publicId;

    const updated = await this.repo.updateSupportCard(
      oid,
      {
        ...nextPatch,
        publishedAt: publishedAtFor(nextPatch.status),
      },
      { actorId: ctx?.actorUserId ?? undefined },
    );
    const newPid = updated?.image?.publicId;
    if (oldPid && newPid && oldPid !== newPid) await this.cloudinary.destroy(oldPid);
    await invalidateCatalogCache(["homepage"]);
    return updated;
  }

  async deleteSupportCard(id: string, ctx?: WriteContext): Promise<HomepageSupportCardDocument | null> {
    const oid = toObjectId(id);
    const cur = await this.repo.findSupportCardById(oid, { actorId: ctx?.actorUserId ?? undefined });
    const pid = cur?.image?.publicId;
    const deleted = await this.repo.deleteSupportCard(oid, { actorId: ctx?.actorUserId ?? undefined });
    if (pid) await this.cloudinary.destroy(pid);
    await invalidateCatalogCache(["homepage"]);
    return deleted;
  }
}

export default HomepageService;

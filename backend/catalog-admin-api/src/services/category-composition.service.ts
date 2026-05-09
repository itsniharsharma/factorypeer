import type { ClientSession, Types } from "mongoose";
import type {
  CategoryCompositionDocument,
  OverviewSectionDocument,
  FamilySectionDocument,
} from "@factorypeer/catalog-models";
import type { CategoryCompositionRepository } from "../repositories/category-composition.repository.js";
import type { CategoryRepository } from "../repositories/category.repository.js";
import type { ExecOpts } from "../repositories/exec-opts.js";
import {
  resourceNotFound,
  categoryNotFound,
  compositionAlreadyExists,
} from "../errors/domain.js";
import { withTransaction } from "../db/with-transaction.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";
import { adminCacheAside } from "../utils/admin-cache.js";
import { invalidateCatalogCache } from "../utils/cache.js";

function eo(ctx?: WriteContext, session?: ClientSession): ExecOpts {
  return { actorId: ctx?.actorUserId ?? undefined, session };
}

export class CategoryCompositionService {
  constructor(
    private readonly compositions: CategoryCompositionRepository,
    private readonly categories: CategoryRepository,
  ) {}

  /**
   * Get composition by ID with cache-aside.
   */
  async getById(id: string, ctx?: WriteContext) {
    return adminCacheAside({
      scope: "composition" as any,
      key: `by-id:${id}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const doc = await this.compositions.findById(toObjectId(id), eo(ctx));
        if (!doc) throw resourceNotFound("CategoryComposition", id);
        return doc;
      },
    });
  }

  /**
   * Get composition by category ID.
   */
  async getByCategory(categoryId: string, ctx?: WriteContext) {
    return adminCacheAside({
      scope: "composition" as any,
      key: `by-category:${categoryId}`,
      ttlSeconds: 120,
      staleWhileRevalidateSeconds: 30,
      loader: async () => {
        const doc = await this.compositions.findByCategoryId(
          toObjectId(categoryId),
          eo(ctx),
        );
        if (!doc) throw resourceNotFound("CategoryComposition for category", categoryId);
        return doc;
      },
    });
  }

  /**
   * List all compositions (admin panel).
   */
  async list(ctx?: WriteContext) {
    return this.compositions.listAll(eo(ctx));
  }

  /**
   * Create a new composition for a category.
   * Validates category exists and composition doesn't already exist.
   */
  async create(
    input: {
      categoryId: string;
      slugPath: string;
      overviewSection: any;
      familySections?: any[];
      seo?: any;
    },
    ctx?: WriteContext,
  ) {
    return withTransaction(async (session) => {
      const categoryId = toObjectId(input.categoryId);

      // Verify category exists
      const category = await this.categories.findById(categoryId, eo(ctx, session));
      if (!category) throw categoryNotFound(input.categoryId);

      // Check composition doesn't already exist
      const existing = await this.compositions.findByCategoryId(categoryId, eo(ctx, session));
      if (existing) throw compositionAlreadyExists(input.categoryId);

      const doc = await this.compositions.create(
        {
          categoryId,
          slugPath: input.slugPath,
          status: "draft",
          overviewSection: input.overviewSection,
          familySections: (input.familySections ?? []) as any,
          seo: input.seo ?? { keywords: [] },
        },
        eo(ctx, session),
      );

      // Invalidate cache
      await invalidateCatalogCache(["composition"]);

      return doc;
    });
  }

  /**
   * Update composition overview section.
   */
  async updateOverviewSection(
    id: string,
    overviewSection: any,
    ctx?: WriteContext,
  ) {
    const docId = toObjectId(id);
    const updated = await this.compositions.updateFields(
      docId,
      {
        overviewSection,
      },
      eo(ctx),
    );

    if (!updated) throw resourceNotFound("CategoryComposition", id);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Add a family section to the composition.
   */
  async addFamilySection(
    id: string,
    familySection: any,
    ctx?: WriteContext,
  ) {
    const docId = toObjectId(id);
    const doc = await this.compositions.findById(docId, eo(ctx));
    if (!doc) throw resourceNotFound("CategoryComposition", id);

    const familySections = (doc.familySections as any[] || []);
    familySections.push(familySection);

    const updated = await this.compositions.updateFields(
      docId,
      { familySections: familySections as any },
      eo(ctx),
    );

    if (!updated) throw resourceNotFound("CategoryComposition", id);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Update a specific family section by ID.
   */
  async updateFamilySection(
    compositionId: string,
    familySectionId: string,
    updates: any,
    ctx?: WriteContext,
  ) {
    const docId = toObjectId(compositionId);
    const doc = await this.compositions.findById(docId, eo(ctx));
    if (!doc) throw resourceNotFound("CategoryComposition", compositionId);

    const familySections = ((doc.familySections as any) || []).map((section: any) =>
      section.id === familySectionId ? { ...section, ...updates } : section,
    );

    const updated = await this.compositions.updateFields(
      docId,
      { familySections: familySections as any },
      eo(ctx),
    );

    if (!updated) throw resourceNotFound("CategoryComposition", compositionId);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Delete a family section by ID.
   */
  async deleteFamilySection(compositionId: string, familySectionId: string, ctx?: WriteContext) {
    const docId = toObjectId(compositionId);
    const doc = await this.compositions.findById(docId, eo(ctx));
    if (!doc) throw resourceNotFound("CategoryComposition", compositionId);

    const familySections = ((doc.familySections as any) || []).filter(
      (section: any) => section.id !== familySectionId,
    );

    const updated = await this.compositions.updateFields(
      docId,
      { familySections: familySections as any },
      eo(ctx),
    );

    if (!updated) throw resourceNotFound("CategoryComposition", compositionId);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Reorder family sections.
   */
  async reorderFamilySections(
    id: string,
    orderedIds: string[],
    ctx?: WriteContext,
  ) {
    const docId = toObjectId(id);
    const doc = await this.compositions.findById(docId, eo(ctx));
    if (!doc) throw resourceNotFound("CategoryComposition", id);

    const familySectionMap = new Map(
      (doc.familySections ?? []).map((s: any) => [s.id, s.toObject?.() || s])
    );
    const reordered: any[] = [];

    for (const sectionId of orderedIds) {
      const section = familySectionMap.get(sectionId);
      if (section) {
        reordered.push({ ...section, sortOrder: reordered.length });
      }
    }

    const updated = await this.compositions.updateFields(
      docId,
      {
        familySections: reordered as any,
      },
      eo(ctx),
    );

    if (!updated) throw resourceNotFound("CategoryComposition", id);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Update SEO metadata.
   */
  async updateSeo(
    id: string,
    seo: Record<string, any>,
    ctx?: WriteContext,
  ) {
    const docId = toObjectId(id);
    const updated = await this.compositions.updateFields(
      docId,
      { 
        seo: {
          keywords: seo.keywords ?? [],
          metaTitle: seo.metaTitle,
          metaDescription: seo.metaDescription,
        }
      },
      eo(ctx),
    );

    if (!updated) throw resourceNotFound("CategoryComposition", id);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Publish composition.
   */
  async publish(id: string, ctx?: WriteContext) {
    const docId = toObjectId(id);
    const updated = await this.compositions.publishComposition(docId, eo(ctx));

    if (!updated) throw resourceNotFound("CategoryComposition", id);

    // Invalidate cache
    await invalidateCatalogCache(["composition", "taxonomy"] as any);

    return updated;
  }

  /**
   * Archive composition.
   */
  async archive(id: string, ctx?: WriteContext) {
    const docId = toObjectId(id);
    const updated = await this.compositions.archiveComposition(docId, eo(ctx));

    if (!updated) throw resourceNotFound("CategoryComposition", id);

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return updated;
  }

  /**
   * Delete composition.
   */
  async delete(id: string, ctx?: WriteContext) {
    const docId = toObjectId(id);
    await this.compositions.delete(docId, eo(ctx));

    // Invalidate cache
    await invalidateCatalogCache(["composition"] as any);

    return { success: true };
  }
}

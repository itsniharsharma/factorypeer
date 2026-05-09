import { z } from "zod";

/**
 * Validation schemas for category composition admin APIs.
 */

const tableColumnSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["string", "number", "currency", "dimension", "boolean"]),
  width: z.number().default(120),
  sortable: z.boolean().default(false),
  isPrice: z.boolean().default(false),
  isMandatory: z.boolean().default(false),
});

const tableRowSchema = z.object({
  price: z.string().min(1),
  values: z.record(z.string()).optional(),
  sortOrder: z.number().default(0),
});

const comparisonTableSchema = z.object({
  columns: z.array(tableColumnSchema).min(1),
  rows: z.array(tableRowSchema).default([]),
});

const featureBulletSchema = z.object({
  text: z.string().min(1),
  sortOrder: z.number().default(0),
});

const catalogMediaAssetSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  format: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  altText: z.string().optional(),
});

const familySectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  image: catalogMediaAssetSchema.optional(),
  description: z.string(),
  featureBullets: z.array(featureBulletSchema).optional(),
  table: comparisonTableSchema,
  sortOrder: z.number().optional(),
  publishStatus: z.enum(["draft", "published", "archived"]).optional(),
});

const familyPreviewCardSchema = z.object({
  familySectionId: z.string().min(1),
  sortOrder: z.number().default(0),
});

const overviewSectionSchema = z.object({
  heading: z.string().min(1),
  productCountMode: z.enum(["exact", "approximate", "hidden"]).default("exact"),
  description: z.string(),
  familyPreviewCards: z.array(familyPreviewCardSchema).optional(),
});

const compositionSeoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const createCompositionBodySchema = z.object({
  categoryId: z.string().min(1),
  slugPath: z.string().min(1),
  overviewSection: overviewSectionSchema,
  familySections: z.array(familySectionSchema).optional().default([]),
  seo: compositionSeoSchema.optional().default({}),
});

export const updateCompositionOverviewBodySchema = z.object({
  overviewSection: overviewSectionSchema,
});

export const addFamilySectionBodySchema = z.object({
  familySection: familySectionSchema.extend({
    sortOrder: z.number().default(0),
    publishStatus: z.enum(["draft", "published", "archived"]).default("draft"),
  }),
});

export const updateFamilySectionBodySchema = familySectionSchema.extend({
  sortOrder: z.number().default(0),
  publishStatus: z.enum(["draft", "published", "archived"]).default("draft"),
}).partial();

export const reorderFamilySectionsBodySchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(0),
});

export const updateCompositionSeoBodySchema = z.object({
  seo: compositionSeoSchema.extend({
    keywords: z.array(z.string()).optional().default([]),
  }),
});

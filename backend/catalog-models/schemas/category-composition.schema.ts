import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { PublishStatus } from "../enums.js";
import { catalogMediaAssetSchema } from "./catalog-media-asset.schema.js";

/**
 * Table column definition—strongly typed, not a JSON blob.
 * Price column: REQUIRED, ALWAYS LAST, CANNOT BE REMOVED.
 */
const tableColumnSchema = new Schema(
  {
    key: { type: String, required: true }, // e.g. "price", "weight", "material"
    label: { type: String, required: true }, // e.g. "Price", "Weight", "Material"
    type: {
      type: String,
      enum: ["string", "number", "currency", "dimension", "boolean"],
      required: true,
    },
    width: { type: Number, default: 120 }, // pixels for rendering
    sortable: { type: Boolean, default: false },
    isPrice: { type: Boolean, default: false }, // ONLY true for price column
    isMandatory: { type: Boolean, default: false }, // Price is always mandatory=true
  },
  { _id: false },
);

/**
 * Table row—strongly typed fields, not a generic object.
 * Supports string, number, currency, dimension values; boolean for specs.
 */
const tableRowSchema = new Schema(
  {
    // Unique row ID within this table
    _id: { type: Schema.Types.ObjectId, auto: true },

    // Price is REQUIRED in every row, always mapped to "price" key
    price: { type: String, required: true }, // e.g. "$49.99", "€35,50"

    // Other column values: keyed by column key
    values: { type: Schema.Types.Map, of: String, default: new Map() },

    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

/**
 * Comparison table—columns define structure, rows populate data.
 * Price column is enforced by design, not by validation.
 */
const comparisonTableSchema = new Schema(
  {
    // Column definitions—price is implicit in tableRowSchema
    columns: {
      type: [tableColumnSchema],
      required: true,
      validate: {
        validator: (cols: any[]) => {
          // At least one column (price)
          if (cols.length === 0) return false;
          // Price column must be last and only price column
          const priceColumns = cols.filter((c) => c.isPrice);
          if (priceColumns.length !== 1) return false;
          if (cols[cols.length - 1].isPrice !== true) return false;
          return true;
        },
        message: "Price column must be present, be exactly one, and be last",
      },
    },

    // Row data
    rows: { type: [tableRowSchema], default: [] },
  },
  { _id: false },
);

/**
 * Feature bullet point in a family section.
 */
const featureBulletSchema = new Schema(
  {
    text: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

/**
 * Family section—repeatable block with title, description, table, etc.
 */
const familySectionSchema = new Schema(
  {
    // Unique ID within this composition (not _id, but a business key)
    id: { type: String, required: true },

    // Section title and slug for anchoring
    title: { type: String, required: true },
    slug: { type: String, required: true }, // e.g. "box-step-tools"

    // Image for the section
    image: { type: catalogMediaAssetSchema, required: false },

    // Engineering/SEO description
    description: { type: String, default: "" },

    // Feature bullets
    featureBullets: {
      type: [featureBulletSchema],
      default: [],
    },

    // Comparison table for this section
    table: { type: comparisonTableSchema, required: true },

    sortOrder: { type: Number, default: 0 },

    // Draft/published state for this section only
    publishStatus: {
      type: String,
      enum: ["draft", "published", "archived"] satisfies PublishStatus[],
      default: "draft",
    },
  },
  { _id: false },
);

/**
 * Family preview card—shown in overview section.
 */
const familyPreviewCardSchema = new Schema(
  {
    // Reference to family section ID
    familySectionId: { type: String, required: true },

    // Display order
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

/**
 * Overview section—single per category composition.
 * Contains category description, product count, and optional family preview cards.
 */
const overviewSectionSchema = new Schema(
  {
    // Main heading (usually category title)
    heading: { type: String, required: true },

    // How to display product count: "exact", "approximate", "hidden"
    productCountMode: {
      type: String,
      enum: ["exact", "approximate", "hidden"],
      default: "exact",
    },

    // Rich description (markdown or plain text)
    description: { type: String, default: "" },

    // Optional preview cards linking to key family sections
    familyPreviewCards: {
      type: [familyPreviewCardSchema],
      default: [],
    },
  },
  { _id: false },
);

/**
 * SEO metadata for the category composition page.
 */
const compositionSeoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false },
);

/**
 * Category Composition—admin-driven page structure for category nodes.
 *
 * One composition per category (categoryId is unique).
 * Contains overview section (single) + family sections (repeatable).
 * Version-aware for cache invalidation.
 * Strongly typed schema: no JSON blobs.
 */
const categoryCompositionSchema = new Schema(
  {
    /** Multi-tenant key; use constant ObjectId or omit if single-tenant. */
    tenantId: { type: Schema.Types.ObjectId, index: true },

    /** Reference to the category (one composition per category). */
    categoryId: { type: Schema.Types.ObjectId, ref: "CatalogCategory", required: true },

    /** Materialized path for routing (e.g., "machining/step-stools"). */
    slugPath: { type: String, required: true },

    /** Public state: draft/published/archived. */
    status: {
      type: String,
      enum: ["draft", "published", "archived"] satisfies PublishStatus[],
      default: "draft",
      index: true,
    },

    /** Single overview section. */
    overviewSection: { type: overviewSectionSchema, required: true },

    /** Repeatable family sections. */
    familySections: {
      type: [familySectionSchema],
      default: [],
    },

    /** SEO metadata. */
    seo: { type: compositionSeoSchema, default: {} },

    /** Published timestamp. */
    publishedAt: { type: Date, default: null },

    /** Audit — optional admin actor ids. */
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },

    /** Optimistic concurrency / traceability. */
    documentVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

categoryCompositionSchema.index({ tenantId: 1, categoryId: 1 }, { unique: true });
categoryCompositionSchema.index({ tenantId: 1, status: 1 });
categoryCompositionSchema.index({ tenantId: 1, slugPath: 1 });

export type TableColumnDocument = InferSchemaType<typeof tableColumnSchema>;
export type TableRowDocument = InferSchemaType<typeof tableRowSchema>;
export type ComparisonTableDocument = InferSchemaType<typeof comparisonTableSchema>;
export type FeatureBulletDocument = InferSchemaType<typeof featureBulletSchema>;
export type FamilySectionDocument = InferSchemaType<typeof familySectionSchema>;
export type FamilyPreviewCardDocument = InferSchemaType<typeof familyPreviewCardSchema>;
export type OverviewSectionDocument = InferSchemaType<typeof overviewSectionSchema>;
export type CompositionSeoDocument = InferSchemaType<typeof compositionSeoSchema>;

export type CategoryCompositionDocument = InferSchemaType<typeof categoryCompositionSchema> & {
  _id: Types.ObjectId;
};

export type CategoryCompositionModel = Model<CategoryCompositionDocument>;

export function registerCategoryCompositionSchema() {
  return categoryCompositionSchema;
}

// Export schemas for composition in other modules
export {
  tableColumnSchema,
  tableRowSchema,
  comparisonTableSchema,
  featureBulletSchema,
  familySectionSchema,
  familyPreviewCardSchema,
  overviewSectionSchema,
  compositionSeoSchema,
};

import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { CatalogCategoryKind, PublishStatus } from "../enums.js";
import { catalogMediaAssetSchema } from "./catalog-media-asset.schema.js";

/**
 * Taxonomy node (CatalogCategory / TaxonomyNode).
 * Unlimited depth via adjacency list + materialized `path` for URL routing.
 */
const catalogCategorySchema = new Schema(
  {
    /** Optional multi-tenant key; use constant ObjectId or omit if single-tenant. */
    tenantId: { type: Schema.Types.ObjectId, index: true },

    parentId: { type: Schema.Types.ObjectId, ref: "CatalogCategory", default: null },

    /** Unique among siblings; combined into `path`. */
    slug: { type: String, required: true, trim: true },

    /** Materialized path e.g. "machining/milling/milling-cutters/t-slot-milling-cutters". */
    path: { type: String, required: true, trim: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },
    landingImage: { type: catalogMediaAssetSchema, required: false },

    kind: {
      type: String,
      enum: ["branch", "family"] satisfies CatalogCategoryKind[],
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"] satisfies PublishStatus[],
      default: "draft",
      index: true,
    },

    sortOrder: { type: Number, default: 0 },

    /** Denormalized for mega-menu / listing; maintain via job or aggregation. */
    productCount: { type: Number, default: 0 },

    /**
     * Active published spec schema for `family` nodes.
     * Draft schema can be edited separately and swapped on publish.
     */
    activeSpecSchemaId: {
      type: Schema.Types.ObjectId,
      ref: "CatalogSpecSchema",
      default: null,
    },

    /** Facet configuration IDs or embedded keys — placeholder for PLP filters. */
    filterFacetGroupIds: [{ type: Schema.Types.ObjectId }],

    publishedAt: { type: Date, default: null },

    /** Audit — optional admin actor ids (set by catalog-admin-api). */
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    /** Incremented on each persisted change (optimistic concurrency / traceability). */
    documentVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

catalogCategorySchema.index({ tenantId: 1, path: 1 }, { unique: true });
catalogCategorySchema.index({ parentId: 1, slug: 1 }, { unique: true });
catalogCategorySchema.index({ status: 1, sortOrder: 1 });

export type CatalogCategoryDocument = InferSchemaType<typeof catalogCategorySchema> & {
  _id: Types.ObjectId;
};

export type CatalogCategoryModel = Model<CatalogCategoryDocument>;

export function registerCatalogCategorySchema() {
  return catalogCategorySchema;
}

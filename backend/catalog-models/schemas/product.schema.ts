import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { PublishStatus } from "../enums.js";

const productMediaItemSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const productAttachmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    docType: {
      type: String,
      enum: ["manual", "datasheet", "sds", "certification", "drawing", "other"],
      default: "other",
    },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

/** PDP logistics rows — shipping terms, hazmat flags, etc. */
const logisticsMetaPairSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

/**
 * Product shell — PDP slug and merchandising; variants carry SKUs.
 */
const productSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, index: true },

    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true },

    brand: { type: String, trim: true },

    status: {
      type: String,
      enum: ["draft", "published", "archived"] satisfies PublishStatus[],
      default: "draft",
      index: true,
    },

    /** Default PDP variant when URL has no SKU selector. */
    defaultVariantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },

    /** Categories where product appears (browse / facets). */
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "CatalogCategory" }],

    /** Denormalized for MongoDB text index + autocomplete. */
    searchText: { type: String, default: "" },
    // Denormalized searchable fields for performant product-level search
    searchBlob: { type: String, default: "" },
    searchTokens: { type: [String], default: [] },
    searchableBrands: { type: [String], default: [] },
    searchableCategories: { type: [String], default: [] },
    searchableSpecs: { type: [String], default: [] },

    /** PDP gallery — primary + alternates (sorted by sortOrder, then array order). */
    media: { type: [productMediaItemSchema], default: [] },

    /** Full PDP body HTML/markdown-friendly plain text. */
    longDescription: { type: String, default: "" },

    /** Structured bullets — features / differentiators. */
    features: [{ type: String, trim: true }],

    /** Typical applications / industries. */
    applications: [{ type: String, trim: true }],

    /** Short promo bullets (overview strip). */
    marketingBullets: [{ type: String, trim: true }],

    /** Manuals, SDS, certs — URLs managed in admin. */
    attachments: { type: [productAttachmentSchema], default: [] },

    /** Cross-sell blocks — published products only on storefront. */
    relatedProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    compatibleProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    recommendedProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    /** PDP — shipping / procurement (optional; storefront shows placeholders when empty). */
    shippingWeight: { type: String, trim: true },
    branchAvailabilityPlaceholder: { type: String, trim: true },
    logisticsMeta: { type: [logisticsMetaPairSchema], default: [] },

    sortOrder: { type: Number, default: 0 },

    publishedAt: { type: Date, default: null },

    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

productSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
productSchema.index({ status: 1, title: "text", searchText: "text" });
// Product-level search indexes for denormalized fields
productSchema.index({ searchBlob: "text" });
productSchema.index({ searchTokens: 1 });
productSchema.index({ searchableBrands: 1 });
productSchema.index({ searchableCategories: 1 });
/** Featured / recently updated listings (`sort=-updatedAt`). */
productSchema.index({ status: 1, updatedAt: -1 });
/** Category browse / PLP (`categoryId` + published filter). */
productSchema.index({ status: 1, categoryIds: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

export type ProductModel = Model<ProductDocument>;

export function registerProductSchema() {
  return productSchema;
}

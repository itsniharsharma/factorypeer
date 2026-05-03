import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { PublishStatus } from "../enums.js";

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

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

export type ProductModel = Model<ProductDocument>;

export function registerProductSchema() {
  return productSchema;
}

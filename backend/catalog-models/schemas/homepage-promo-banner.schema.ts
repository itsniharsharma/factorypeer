import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { PublishStatus } from "../enums.js";
import { catalogMediaAssetSchema } from "./catalog-media-asset.schema.js";

const homepagePromoBannerSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, index: true },
    slug: { type: String, required: true, trim: true },
    eyebrow: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    image: { type: catalogMediaAssetSchema, required: false },
    ctaLabel: { type: String, trim: true },
    href: { type: String, trim: true },
    openInNewTab: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] satisfies PublishStatus[],
      default: "draft",
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

homepagePromoBannerSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
homepagePromoBannerSchema.index({ tenantId: 1, status: 1, sortOrder: 1 });

export type HomepagePromoBannerDocument = InferSchemaType<typeof homepagePromoBannerSchema> & {
  _id: Types.ObjectId;
};

export type HomepagePromoBannerModel = Model<HomepagePromoBannerDocument>;

export function registerHomepagePromoBannerSchema() {
  return homepagePromoBannerSchema;
}

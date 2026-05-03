import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { PublishStatus } from "../enums.js";

const footerSocialLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const footerContentSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, index: true },
    slug: { type: String, required: true, trim: true },
    brandName: { type: String, trim: true },
    newsletterHeading: { type: String, trim: true },
    newsletterDescription: { type: String, trim: true },
    newsletterCtaLabel: { type: String, trim: true },
    newsletterCtaHref: { type: String, trim: true },
    feedbackHeading: { type: String, trim: true },
    feedbackCtaLabel: { type: String, trim: true },
    feedbackCtaHref: { type: String, trim: true },
    copyrightText: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] satisfies PublishStatus[],
      default: "draft",
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    socialLinks: { type: [footerSocialLinkSchema], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

footerContentSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
footerContentSchema.index({ tenantId: 1, status: 1, sortOrder: 1 });

export type FooterSocialLinkDoc = InferSchemaType<typeof footerSocialLinkSchema>;

export type FooterContentDocument = InferSchemaType<typeof footerContentSchema> & {
  _id: Types.ObjectId;
};

export type FooterContentModel = Model<FooterContentDocument>;

export function registerFooterContentSchema() {
  return footerContentSchema;
}
import { Schema } from "mongoose";
const footerLinkSchema = new Schema({
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    external: { type: Boolean, default: false },
    openInNewTab: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
}, { _id: false });
const footerColumnSchema = new Schema({
    title: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    links: { type: [footerLinkSchema], default: [] },
}, { _id: false });
const footerSocialLinkSchema = new Schema({
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    openInNewTab: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { _id: false });
const footerCtaBlockSchema = new Schema({
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    ctaLabel: { type: String, trim: true },
    ctaHref: { type: String, trim: true },
    ctaExternal: { type: Boolean, default: false },
    ctaOpenInNewTab: { type: Boolean, default: false },
}, { _id: false });
const newsletterBlockSchema = new Schema({
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    inputPlaceholder: { type: String, trim: true },
    buttonLabel: { type: String, trim: true },
    submitHref: { type: String, trim: true },
    submitExternal: { type: Boolean, default: false },
    submitOpenInNewTab: { type: Boolean, default: false },
}, { _id: false });
const appDownloadLinkSchema = new Schema({
    label: { type: String, trim: true },
    href: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    openInNewTab: { type: Boolean, default: true },
}, { _id: false });
const appDownloadBlockSchema = new Schema({
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    appStore: { type: appDownloadLinkSchema, default: {} },
    googlePlay: { type: appDownloadLinkSchema, default: {} },
}, { _id: false });
const connectBlockSchema = new Schema({
    heading: { type: String, trim: true },
    phoneSubtitle: { type: String, trim: true },
    feedbackCtaLabel: { type: String, trim: true },
    feedbackCtaHref: { type: String, trim: true },
    feedbackCtaExternal: { type: Boolean, default: false },
    feedbackCtaOpenInNewTab: { type: Boolean, default: false },
}, { _id: false });
const footerContentSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, index: true },
    slug: { type: String, required: true, trim: true },
    preFooterHeading: { type: String, trim: true },
    preFooterBody: { type: String, trim: true },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    sortOrder: { type: Number, default: 0 },
    columns: { type: [footerColumnSchema], default: [] },
    newsletter: { type: newsletterBlockSchema, default: {} },
    appDownloads: { type: appDownloadBlockSchema, default: {} },
    connect: { type: connectBlockSchema, default: {} },
    contact: { type: footerCtaBlockSchema, default: {} },
    socialLinks: { type: [footerSocialLinkSchema], default: [] },
    legalLinks: { type: [footerLinkSchema], default: [] },
    copyrightText: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
}, { timestamps: true });
footerContentSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
footerContentSchema.index({ tenantId: 1, status: 1, sortOrder: 1 });
export function registerFooterContentSchema() {
    return footerContentSchema;
}

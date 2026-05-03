import { Schema } from "mongoose";
const siteLinkItemSchema = new Schema({
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    external: { type: Boolean, default: false },
    openInNewTab: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published",
        index: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
}, { _id: false });
const siteLinkGroupSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, index: true },
    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    placement: {
        type: String,
        enum: ["utility", "navigation", "footer"],
        required: true,
        index: true,
    },
    description: { type: String, trim: true },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    sortOrder: { type: Number, default: 0 },
    links: { type: [siteLinkItemSchema], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
}, { timestamps: true });
siteLinkGroupSchema.index({ tenantId: 1, placement: 1, slug: 1 }, { unique: true });
siteLinkGroupSchema.index({ tenantId: 1, placement: 1, status: 1, sortOrder: 1 });
export function registerSiteLinkGroupSchema() {
    return siteLinkGroupSchema;
}

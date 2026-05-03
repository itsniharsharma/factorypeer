import { Schema } from "mongoose";
const homepageCategoryTileSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, index: true },
    slug: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "CatalogCategory", default: null },
    href: { type: String, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    imageAlt: { type: String, trim: true },
    icon: { type: String, trim: true },
    ctaLabel: { type: String, trim: true },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
}, { timestamps: true });
homepageCategoryTileSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
homepageCategoryTileSchema.index({ tenantId: 1, status: 1, sortOrder: 1 });
export function registerHomepageCategoryTileSchema() {
    return homepageCategoryTileSchema;
}

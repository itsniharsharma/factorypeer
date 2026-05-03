import { Schema } from "mongoose";
const variantBindingSchema = new Schema({
    productVariantId: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: true,
    },
    role: {
        type: String,
        enum: ["primary", "alternate"],
        default: "primary",
    },
    sortOrder: { type: Number, default: 0 },
}, { _id: false });
/**
 * Matrix row (CatalogSpecRow / VariantRow).
 * Multiple SKUs per row via `variantBindings`; mapper picks primary for legacy UI.
 */
const catalogSpecRowSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, index: true },
    specSchemaId: {
        type: Schema.Types.ObjectId,
        ref: "CatalogSpecSchema",
        required: true,
        index: true,
    },
    taxonomyNodeId: {
        type: Schema.Types.ObjectId,
        ref: "CatalogCategory",
        required: true,
        index: true,
    },
    /** Cell values keyed by CatalogSpecColumn.key */
    values: { type: Map, of: String, default: {} },
    variantBindings: [variantBindingSchema],
    /** Import / sync correlation id. */
    externalKey: { type: String, trim: true, sparse: true },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
}, { timestamps: true });
catalogSpecRowSchema.index({ specSchemaId: 1, sortOrder: 1 });
catalogSpecRowSchema.index({ specSchemaId: 1, status: 1 });
export function registerCatalogSpecRowSchema() {
    return catalogSpecRowSchema;
}

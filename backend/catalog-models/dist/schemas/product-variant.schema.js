import { Schema } from "mongoose";
/**
 * SKU record — pricing, availability; optional link back to matrix row.
 */
const productVariantSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, index: true },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
    sku: { type: String, required: true, trim: true },
    itemNumber: { type: String, trim: true },
    mpn: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    /** Display strings for matrix row DTO (matches frontend CatalogSpecRow). */
    unitPrice: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    availability: { type: String, default: "" },
    uom: { type: String, trim: true },
    /** Procurement messaging — ship/stock narrative. */
    leadTime: { type: String, default: "", trim: true },
    /** Minimum order quantity (units). */
    moq: { type: Number, default: null, min: 1 },
    /** Sell unit / pack description, e.g. "1 EA", "Box of 10". */
    packaging: { type: String, default: "", trim: true },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    /**
     * Optional reverse link when this SKU is driven by a spec matrix row.
     * Row may also list this variant in `variantBindings` — keep in sync in admin writes.
     */
    specRowId: {
        type: Schema.Types.ObjectId,
        ref: "CatalogSpecRow",
        default: null,
        index: true,
    },
    /** Denormalized lines for search / filters. */
    searchBlob: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
}, { timestamps: true });
productVariantSchema.index({ tenantId: 1, sku: 1 }, { unique: true });
productVariantSchema.index({ productId: 1, sortOrder: 1 });
/** First published SKU per product (PDP relation batch + variant lists). */
productVariantSchema.index({ productId: 1, status: 1, sortOrder: 1, sku: 1 });
productVariantSchema.index({
    sku: "text",
    itemNumber: "text",
    mpn: "text",
    searchBlob: "text",
});
// Add single-field indexes to support efficient direct lookups / regex matches
productVariantSchema.index({ itemNumber: 1 });
productVariantSchema.index({ mpn: 1 });
productVariantSchema.index({ searchBlob: 1 });
export function registerProductVariantSchema() {
    return productVariantSchema;
}

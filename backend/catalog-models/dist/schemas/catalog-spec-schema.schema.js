import { Schema } from "mongoose";
/**
 * Spec schema header for a family — owns column definitions and row sets.
 */
const catalogSpecSchemaSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, index: true },
    taxonomyNodeId: {
        type: Schema.Types.ObjectId,
        ref: "CatalogCategory",
        required: true,
        index: true,
    },
    familySummary: { type: String, default: "" },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    /** Increment when column set changes incompatibly. */
    version: { type: Number, default: 1 },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
}, { timestamps: true });
catalogSpecSchemaSchema.index({ tenantId: 1, taxonomyNodeId: 1, status: 1 });
export function registerCatalogSpecSchemaSchema() {
    return catalogSpecSchemaSchema;
}

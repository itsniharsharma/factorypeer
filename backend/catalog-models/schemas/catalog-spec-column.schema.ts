import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
import type { SpecColumnDataType } from "../enums.js";

/**
 * Dynamic column definition per family schema (maps to matrix `values[key]`).
 */
const catalogSpecColumnSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, index: true },

    specSchemaId: {
      type: Schema.Types.ObjectId,
      ref: "CatalogSpecSchema",
      required: true,
      index: true,
    },

    /** Stable key used in row `values` and APIs — e.g. "cutterDia". */
    key: { type: String, required: true, trim: true },

    label: { type: String, required: true },

    dataType: {
      type: String,
      enum: ["string", "number", "boolean", "enum", "dimension"] satisfies SpecColumnDataType[],
      default: "string",
    },

    filterable: { type: Boolean, default: false },
    sortable: { type: Boolean, default: false },
    /** Include in text / facet index pipelines. */
    searchIndex: { type: Boolean, default: false },

    enumOptions: [{ type: String }],
    unit: { type: String, trim: true },

    widthClass: { type: String, trim: true },

    sortOrder: { type: Number, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    documentVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

catalogSpecColumnSchema.index({ specSchemaId: 1, key: 1 }, { unique: true });
catalogSpecColumnSchema.index({ specSchemaId: 1, sortOrder: 1 });

export type CatalogSpecColumnDocument = InferSchemaType<
  typeof catalogSpecColumnSchema
> & { _id: Types.ObjectId };

export type CatalogSpecColumnModel = Model<CatalogSpecColumnDocument>;

export function registerCatalogSpecColumnSchema() {
  return catalogSpecColumnSchema;
}

import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
/**
 * Dynamic column definition per family schema (maps to matrix `values[key]`).
 */
declare const catalogSpecColumnSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    sortOrder: number;
    documentVersion: number;
    searchIndex: boolean;
    specSchemaId: Types.ObjectId;
    key: string;
    label: string;
    dataType: "string" | "number" | "boolean" | "enum" | "dimension";
    filterable: boolean;
    sortable: boolean;
    enumOptions: string[];
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    sortOrder: number;
    documentVersion: number;
    searchIndex: boolean;
    specSchemaId: Types.ObjectId;
    key: string;
    label: string;
    dataType: "string" | "number" | "boolean" | "enum" | "dimension";
    filterable: boolean;
    sortable: boolean;
    enumOptions: string[];
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    sortOrder: number;
    documentVersion: number;
    searchIndex: boolean;
    specSchemaId: Types.ObjectId;
    key: string;
    label: string;
    dataType: "string" | "number" | "boolean" | "enum" | "dimension";
    filterable: boolean;
    sortable: boolean;
    enumOptions: string[];
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type CatalogSpecColumnDocument = InferSchemaType<typeof catalogSpecColumnSchema> & {
    _id: Types.ObjectId;
};
export type CatalogSpecColumnModel = Model<CatalogSpecColumnDocument>;
export declare function registerCatalogSpecColumnSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    sortOrder: number;
    documentVersion: number;
    searchIndex: boolean;
    specSchemaId: Types.ObjectId;
    key: string;
    label: string;
    dataType: "string" | "number" | "boolean" | "enum" | "dimension";
    filterable: boolean;
    sortable: boolean;
    enumOptions: string[];
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    sortOrder: number;
    documentVersion: number;
    searchIndex: boolean;
    specSchemaId: Types.ObjectId;
    key: string;
    label: string;
    dataType: "string" | "number" | "boolean" | "enum" | "dimension";
    filterable: boolean;
    sortable: boolean;
    enumOptions: string[];
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    sortOrder: number;
    documentVersion: number;
    searchIndex: boolean;
    specSchemaId: Types.ObjectId;
    key: string;
    label: string;
    dataType: "string" | "number" | "boolean" | "enum" | "dimension";
    filterable: boolean;
    sortable: boolean;
    enumOptions: string[];
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=catalog-spec-column.schema.d.ts.map
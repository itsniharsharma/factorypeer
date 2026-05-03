import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
/**
 * Spec schema header for a family — owns column definitions and row sets.
 */
declare const catalogSpecSchemaSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    version: number;
    status: "draft" | "published" | "archived";
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    familySummary: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    version: number;
    status: "draft" | "published" | "archived";
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    familySummary: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    version: number;
    status: "draft" | "published" | "archived";
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    familySummary: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type CatalogSpecSchemaDocument = InferSchemaType<typeof catalogSpecSchemaSchema> & {
    _id: Types.ObjectId;
};
export type CatalogSpecSchemaModel = Model<CatalogSpecSchemaDocument>;
export declare function registerCatalogSpecSchemaSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    version: number;
    status: "draft" | "published" | "archived";
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    familySummary: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    version: number;
    status: "draft" | "published" | "archived";
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    familySummary: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    version: number;
    status: "draft" | "published" | "archived";
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    familySummary: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=catalog-spec-schema.schema.d.ts.map
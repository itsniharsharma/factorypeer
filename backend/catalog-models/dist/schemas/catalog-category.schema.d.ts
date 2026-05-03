import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
/**
 * Taxonomy node (CatalogCategory / TaxonomyNode).
 * Unlimited depth via adjacency list + materialized `path` for URL routing.
 */
declare const catalogCategorySchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    path: string;
    title: string;
    description: string;
    kind: "branch" | "family";
    status: "draft" | "published" | "archived";
    sortOrder: number;
    productCount: number;
    filterFacetGroupIds: Types.ObjectId[];
    documentVersion: number;
    tenantId?: Types.ObjectId | null | undefined;
    parentId?: Types.ObjectId | null | undefined;
    activeSpecSchemaId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    path: string;
    title: string;
    description: string;
    kind: "branch" | "family";
    status: "draft" | "published" | "archived";
    sortOrder: number;
    productCount: number;
    filterFacetGroupIds: Types.ObjectId[];
    documentVersion: number;
    tenantId?: Types.ObjectId | null | undefined;
    parentId?: Types.ObjectId | null | undefined;
    activeSpecSchemaId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    path: string;
    title: string;
    description: string;
    kind: "branch" | "family";
    status: "draft" | "published" | "archived";
    sortOrder: number;
    productCount: number;
    filterFacetGroupIds: Types.ObjectId[];
    documentVersion: number;
    tenantId?: Types.ObjectId | null | undefined;
    parentId?: Types.ObjectId | null | undefined;
    activeSpecSchemaId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type CatalogCategoryDocument = InferSchemaType<typeof catalogCategorySchema> & {
    _id: Types.ObjectId;
};
export type CatalogCategoryModel = Model<CatalogCategoryDocument>;
export declare function registerCatalogCategorySchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    path: string;
    title: string;
    description: string;
    kind: "branch" | "family";
    status: "draft" | "published" | "archived";
    sortOrder: number;
    productCount: number;
    filterFacetGroupIds: Types.ObjectId[];
    documentVersion: number;
    tenantId?: Types.ObjectId | null | undefined;
    parentId?: Types.ObjectId | null | undefined;
    activeSpecSchemaId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    path: string;
    title: string;
    description: string;
    kind: "branch" | "family";
    status: "draft" | "published" | "archived";
    sortOrder: number;
    productCount: number;
    filterFacetGroupIds: Types.ObjectId[];
    documentVersion: number;
    tenantId?: Types.ObjectId | null | undefined;
    parentId?: Types.ObjectId | null | undefined;
    activeSpecSchemaId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    path: string;
    title: string;
    description: string;
    kind: "branch" | "family";
    status: "draft" | "published" | "archived";
    sortOrder: number;
    productCount: number;
    filterFacetGroupIds: Types.ObjectId[];
    documentVersion: number;
    tenantId?: Types.ObjectId | null | undefined;
    parentId?: Types.ObjectId | null | undefined;
    activeSpecSchemaId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=catalog-category.schema.d.ts.map
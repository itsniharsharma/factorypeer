import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
/**
 * Product shell — PDP slug and merchandising; variants carry SKUs.
 */
declare const productSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type ProductDocument = InferSchemaType<typeof productSchema> & {
    _id: Types.ObjectId;
};
export type ProductModel = Model<ProductDocument>;
export declare function registerProductSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=product.schema.d.ts.map
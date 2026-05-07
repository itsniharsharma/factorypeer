import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
/**
 * SKU record — pricing, availability; optional link back to matrix row.
 */
declare const productVariantSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    searchBlob: string;
    productId: Types.ObjectId;
    sku: string;
    unitPrice: string;
    currency: string;
    availability: string;
    leadTime: string;
    packaging: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    searchBlob: string;
    productId: Types.ObjectId;
    sku: string;
    unitPrice: string;
    currency: string;
    availability: string;
    leadTime: string;
    packaging: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    searchBlob: string;
    productId: Types.ObjectId;
    sku: string;
    unitPrice: string;
    currency: string;
    availability: string;
    leadTime: string;
    packaging: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type ProductVariantDocument = InferSchemaType<typeof productVariantSchema> & {
    _id: Types.ObjectId;
};
export type ProductVariantModel = Model<ProductVariantDocument>;
export declare function registerProductVariantSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    searchBlob: string;
    productId: Types.ObjectId;
    sku: string;
    unitPrice: string;
    currency: string;
    availability: string;
    leadTime: string;
    packaging: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    searchBlob: string;
    productId: Types.ObjectId;
    sku: string;
    unitPrice: string;
    currency: string;
    availability: string;
    leadTime: string;
    packaging: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    searchBlob: string;
    productId: Types.ObjectId;
    sku: string;
    unitPrice: string;
    currency: string;
    availability: string;
    leadTime: string;
    packaging: string;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=product-variant.schema.d.ts.map
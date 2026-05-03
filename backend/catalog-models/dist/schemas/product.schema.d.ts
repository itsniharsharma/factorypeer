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
    media: Types.DocumentArray<{
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }> & {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }>;
    longDescription: string;
    features: string[];
    applications: string[];
    marketingBullets: string[];
    attachments: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }> & {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }>;
    relatedProductIds: Types.ObjectId[];
    compatibleProductIds: Types.ObjectId[];
    recommendedProductIds: Types.ObjectId[];
    logisticsMeta: Types.DocumentArray<{
        label: string;
        value: string;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        value: string;
    }> & {
        label: string;
        value: string;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    media: Types.DocumentArray<{
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }> & {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }>;
    longDescription: string;
    features: string[];
    applications: string[];
    marketingBullets: string[];
    attachments: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }> & {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }>;
    relatedProductIds: Types.ObjectId[];
    compatibleProductIds: Types.ObjectId[];
    recommendedProductIds: Types.ObjectId[];
    logisticsMeta: Types.DocumentArray<{
        label: string;
        value: string;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        value: string;
    }> & {
        label: string;
        value: string;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
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
    media: Types.DocumentArray<{
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }> & {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }>;
    longDescription: string;
    features: string[];
    applications: string[];
    marketingBullets: string[];
    attachments: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }> & {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }>;
    relatedProductIds: Types.ObjectId[];
    compatibleProductIds: Types.ObjectId[];
    recommendedProductIds: Types.ObjectId[];
    logisticsMeta: Types.DocumentArray<{
        label: string;
        value: string;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        value: string;
    }> & {
        label: string;
        value: string;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
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
    media: Types.DocumentArray<{
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }> & {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }>;
    longDescription: string;
    features: string[];
    applications: string[];
    marketingBullets: string[];
    attachments: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }> & {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }>;
    relatedProductIds: Types.ObjectId[];
    compatibleProductIds: Types.ObjectId[];
    recommendedProductIds: Types.ObjectId[];
    logisticsMeta: Types.DocumentArray<{
        label: string;
        value: string;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        value: string;
    }> & {
        label: string;
        value: string;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    categoryIds: Types.ObjectId[];
    searchText: string;
    media: Types.DocumentArray<{
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }> & {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }>;
    longDescription: string;
    features: string[];
    applications: string[];
    marketingBullets: string[];
    attachments: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }> & {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }>;
    relatedProductIds: Types.ObjectId[];
    compatibleProductIds: Types.ObjectId[];
    recommendedProductIds: Types.ObjectId[];
    logisticsMeta: Types.DocumentArray<{
        label: string;
        value: string;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        value: string;
    }> & {
        label: string;
        value: string;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
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
    media: Types.DocumentArray<{
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }> & {
        sortOrder: number;
        url: string;
        alt?: string | null | undefined;
    }>;
    longDescription: string;
    features: string[];
    applications: string[];
    marketingBullets: string[];
    attachments: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }> & {
        title: string;
        sortOrder: number;
        url: string;
        docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
    }>;
    relatedProductIds: Types.ObjectId[];
    compatibleProductIds: Types.ObjectId[];
    recommendedProductIds: Types.ObjectId[];
    logisticsMeta: Types.DocumentArray<{
        label: string;
        value: string;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        value: string;
    }> & {
        label: string;
        value: string;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: Types.ObjectId | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=product.schema.d.ts.map
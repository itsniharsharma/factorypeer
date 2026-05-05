import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
declare const homepagePromoBannerSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    openInNewTab: boolean;
    metadata: any;
    description?: string | null | undefined;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    eyebrow?: string | null | undefined;
    subtitle?: string | null | undefined;
    image?: {
        url: string;
        publicId?: string | null | undefined;
        alt?: string | null | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        format?: string | null | undefined;
    } | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    openInNewTab: boolean;
    metadata: any;
    description?: string | null | undefined;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    eyebrow?: string | null | undefined;
    subtitle?: string | null | undefined;
    image?: {
        url: string;
        publicId?: string | null | undefined;
        alt?: string | null | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        format?: string | null | undefined;
    } | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    openInNewTab: boolean;
    metadata: any;
    description?: string | null | undefined;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    eyebrow?: string | null | undefined;
    subtitle?: string | null | undefined;
    image?: {
        url: string;
        publicId?: string | null | undefined;
        alt?: string | null | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        format?: string | null | undefined;
    } | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type HomepagePromoBannerDocument = InferSchemaType<typeof homepagePromoBannerSchema> & {
    _id: Types.ObjectId;
};
export type HomepagePromoBannerModel = Model<HomepagePromoBannerDocument>;
export declare function registerHomepagePromoBannerSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    openInNewTab: boolean;
    metadata: any;
    description?: string | null | undefined;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    eyebrow?: string | null | undefined;
    subtitle?: string | null | undefined;
    image?: {
        url: string;
        publicId?: string | null | undefined;
        alt?: string | null | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        format?: string | null | undefined;
    } | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    openInNewTab: boolean;
    metadata: any;
    description?: string | null | undefined;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    eyebrow?: string | null | undefined;
    subtitle?: string | null | undefined;
    image?: {
        url: string;
        publicId?: string | null | undefined;
        alt?: string | null | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        format?: string | null | undefined;
    } | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    openInNewTab: boolean;
    metadata: any;
    description?: string | null | undefined;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    eyebrow?: string | null | undefined;
    subtitle?: string | null | undefined;
    image?: {
        url: string;
        publicId?: string | null | undefined;
        alt?: string | null | undefined;
        width?: number | null | undefined;
        height?: number | null | undefined;
        format?: string | null | undefined;
    } | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=homepage-promo-banner.schema.d.ts.map
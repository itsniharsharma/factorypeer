import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
declare const homepageCategoryTileSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    label: string;
    imageUrl: string;
    metadata: any;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    imageAlt?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
    categoryId?: Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    label: string;
    imageUrl: string;
    metadata: any;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    imageAlt?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
    categoryId?: Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    label: string;
    imageUrl: string;
    metadata: any;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    imageAlt?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
    categoryId?: Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type HomepageCategoryTileDocument = InferSchemaType<typeof homepageCategoryTileSchema> & {
    _id: Types.ObjectId;
};
export type HomepageCategoryTileModel = Model<HomepageCategoryTileDocument>;
export declare function registerHomepageCategoryTileSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    label: string;
    imageUrl: string;
    metadata: any;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    imageAlt?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
    categoryId?: Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    label: string;
    imageUrl: string;
    metadata: any;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    imageAlt?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
    categoryId?: Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    label: string;
    imageUrl: string;
    metadata: any;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    imageAlt?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    href?: string | null | undefined;
    categoryId?: Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=homepage-category-tile.schema.d.ts.map
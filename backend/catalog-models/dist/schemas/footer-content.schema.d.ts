import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
declare const footerSocialLinkSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    sortOrder: number;
    label: string;
    href: string;
    icon?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    sortOrder: number;
    label: string;
    href: string;
    icon?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    sortOrder: number;
    label: string;
    href: string;
    icon?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const footerContentSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brandName?: string | null | undefined;
    newsletterHeading?: string | null | undefined;
    newsletterDescription?: string | null | undefined;
    newsletterCtaLabel?: string | null | undefined;
    newsletterCtaHref?: string | null | undefined;
    feedbackHeading?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brandName?: string | null | undefined;
    newsletterHeading?: string | null | undefined;
    newsletterDescription?: string | null | undefined;
    newsletterCtaLabel?: string | null | undefined;
    newsletterCtaHref?: string | null | undefined;
    feedbackHeading?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brandName?: string | null | undefined;
    newsletterHeading?: string | null | undefined;
    newsletterDescription?: string | null | undefined;
    newsletterCtaLabel?: string | null | undefined;
    newsletterCtaHref?: string | null | undefined;
    feedbackHeading?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type FooterSocialLinkDoc = InferSchemaType<typeof footerSocialLinkSchema>;
export type FooterContentDocument = InferSchemaType<typeof footerContentSchema> & {
    _id: Types.ObjectId;
};
export type FooterContentModel = Model<FooterContentDocument>;
export declare function registerFooterContentSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brandName?: string | null | undefined;
    newsletterHeading?: string | null | undefined;
    newsletterDescription?: string | null | undefined;
    newsletterCtaLabel?: string | null | undefined;
    newsletterCtaHref?: string | null | undefined;
    feedbackHeading?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brandName?: string | null | undefined;
    newsletterHeading?: string | null | undefined;
    newsletterDescription?: string | null | undefined;
    newsletterCtaLabel?: string | null | undefined;
    newsletterCtaHref?: string | null | undefined;
    feedbackHeading?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    brandName?: string | null | undefined;
    newsletterHeading?: string | null | undefined;
    newsletterDescription?: string | null | undefined;
    newsletterCtaLabel?: string | null | undefined;
    newsletterCtaHref?: string | null | undefined;
    feedbackHeading?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=footer-content.schema.d.ts.map
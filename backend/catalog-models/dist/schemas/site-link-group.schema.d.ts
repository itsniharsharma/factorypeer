import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
export type SiteLinkGroupPlacement = "utility" | "navigation" | "footer";
declare const siteLinkItemSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    status: "draft" | "published" | "archived";
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    metadata: any;
    external: boolean;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "draft" | "published" | "archived";
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    metadata: any;
    external: boolean;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    status: "draft" | "published" | "archived";
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    metadata: any;
    external: boolean;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const siteLinkGroupSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    placement: "utility" | "navigation" | "footer";
    links: Types.DocumentArray<{
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    placement: "utility" | "navigation" | "footer";
    links: Types.DocumentArray<{
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    placement: "utility" | "navigation" | "footer";
    links: Types.DocumentArray<{
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type SiteLinkDoc = InferSchemaType<typeof siteLinkItemSchema>;
export type SiteLinkGroupDocument = InferSchemaType<typeof siteLinkGroupSchema> & {
    _id: Types.ObjectId;
};
export type SiteLinkGroupModel = Model<SiteLinkGroupDocument>;
export declare function registerSiteLinkGroupSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    placement: "utility" | "navigation" | "footer";
    links: Types.DocumentArray<{
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    placement: "utility" | "navigation" | "footer";
    links: Types.DocumentArray<{
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    placement: "utility" | "navigation" | "footer";
    links: Types.DocumentArray<{
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        metadata: any;
        external: boolean;
        description?: string | null | undefined;
        icon?: string | null | undefined;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    description?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=site-link-group.schema.d.ts.map
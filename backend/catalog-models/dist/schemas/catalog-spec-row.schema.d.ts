import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
/**
 * Matrix row (CatalogSpecRow / VariantRow).
 * Multiple SKUs per row via `variantBindings`; mapper picks primary for legacy UI.
 */
declare const catalogSpecRowSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    values: Map<string, string>;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    specSchemaId: Types.ObjectId;
    variantBindings: Types.DocumentArray<{
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }> & {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    externalKey?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    values: Map<string, string>;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    specSchemaId: Types.ObjectId;
    variantBindings: Types.DocumentArray<{
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }> & {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    externalKey?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    values: Map<string, string>;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    specSchemaId: Types.ObjectId;
    variantBindings: Types.DocumentArray<{
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }> & {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    externalKey?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type CatalogSpecRowDocument = InferSchemaType<typeof catalogSpecRowSchema> & {
    _id: Types.ObjectId;
};
export type CatalogSpecRowModel = Model<CatalogSpecRowDocument>;
export declare function registerCatalogSpecRowSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    values: Map<string, string>;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    specSchemaId: Types.ObjectId;
    variantBindings: Types.DocumentArray<{
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }> & {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    externalKey?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    values: Map<string, string>;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    specSchemaId: Types.ObjectId;
    variantBindings: Types.DocumentArray<{
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }> & {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    externalKey?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    values: Map<string, string>;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    taxonomyNodeId: Types.ObjectId;
    specSchemaId: Types.ObjectId;
    variantBindings: Types.DocumentArray<{
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }> & {
        sortOrder: number;
        productVariantId: Types.ObjectId;
        role: "primary" | "alternate";
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    externalKey?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=catalog-spec-row.schema.d.ts.map
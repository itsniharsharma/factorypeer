import type { Types } from "mongoose";
import type { CategoryRepository } from "../repositories/category.repository.js";
import type { SpecSchemaRepository } from "../repositories/spec-schema.repository.js";
import type { SpecColumnRepository } from "../repositories/spec-column.repository.js";
import type { SpecRowRepository } from "../repositories/spec-row.repository.js";
import type { WriteContext } from "../types/write-context.js";
export declare class SpecMatrixService {
    private readonly categories;
    private readonly specSchemas;
    private readonly columns;
    private readonly rows;
    constructor(categories: CategoryRepository, specSchemas: SpecSchemaRepository, columns: SpecColumnRepository, rows: SpecRowRepository);
    getSchemaForCategory(categoryId: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createSchema(categoryId: string, input: {
        familySummary?: string;
        status?: string;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateSchema(schemaId: string, patch: {
        familySummary?: string;
        status?: string;
    }, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getSchema(schemaId: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    publishSchema(schemaId: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    listColumns(schemaId: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    addColumn(schemaId: string, input: Record<string, unknown>, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateColumn(columnId: string, patch: Record<string, unknown>, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteColumn(columnId: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    listRows(schemaId: string, ctx?: WriteContext, listOpts?: {
        status?: string;
        skip?: number;
        limit?: number;
    }): Promise<{
        items: Record<string, unknown>[];
        total: number;
    }>;
    addRow(schemaId: string, input: {
        values?: Record<string, string>;
        variantBindings?: Array<{
            productVariantId: string;
            role?: "primary" | "alternate";
            sortOrder?: number;
        }>;
        externalKey?: string;
        status?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<Record<string, unknown>>;
    updateRow(rowId: string, patch: {
        values?: Record<string, string>;
        variantBindings?: Array<{
            productVariantId: string;
            role?: "primary" | "alternate";
            sortOrder?: number;
        }>;
        externalKey?: string | null;
        status?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<Record<string, unknown> | null>;
    setRowBindings(rowId: string, bindings: Array<{
        productVariantId: string;
        role?: "primary" | "alternate";
        sortOrder?: number;
    }>, ctx?: WriteContext): Promise<Record<string, unknown>>;
    deleteRow(rowId: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    reorderRows(schemaId: string, orderedIds: string[], ctx?: WriteContext): Promise<Record<string, unknown>[]>;
    private serializeRow;
}
//# sourceMappingURL=spec-matrix.service.d.ts.map
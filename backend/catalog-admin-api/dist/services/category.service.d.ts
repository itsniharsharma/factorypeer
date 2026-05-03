import type { Types } from "mongoose";
import type { CategoryRepository } from "../repositories/category.repository.js";
import type { SpecSchemaRepository } from "../repositories/spec-schema.repository.js";
import type { WriteContext } from "../types/write-context.js";
export declare class CategoryService {
    private readonly categories;
    private readonly specSchemas;
    constructor(categories: CategoryRepository, specSchemas: SpecSchemaRepository);
    getById(id: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    listChildren(parentId: string | null, ctx?: WriteContext, filters?: {
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /** Recursive tree for admin (nested children). */
    getTree(ctx?: WriteContext): Promise<unknown[]>;
    create(input: {
        parentId?: string | null;
        slug: string;
        title: string;
        description?: string;
        kind: "branch" | "family";
        status?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    update(id: string, patch: {
        slug?: string;
        title?: string;
        description?: string;
        kind?: "branch" | "family";
        status?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    move(categoryId: string, newParentId: string | null, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    reorderSiblings(categoryId: string, orderedIds: string[], ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    setKind(id: string, kind: "branch" | "family", ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    attachActiveSpecSchema(categoryId: string, specSchemaId: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogCategoryDocument, {}, {}> & {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=category.service.d.ts.map
import type { Types } from "mongoose";
import type { CatalogCategoryDocument } from "@factorypeer/catalog-models";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export declare class CategoryRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    findById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    findByPath(path: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    listChildren(parentId: Types.ObjectId | null, sort?: "sortOrder" | "title", opts?: ExecOpts & {
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    countDirectChildren(parentId: Types.ObjectId | null, opts?: ExecOpts): Promise<number>;
    slugExistsAmongSiblings(parentId: Types.ObjectId | null, slug: string, excludeId?: Types.ObjectId, opts?: ExecOpts): Promise<boolean>;
    create(data: {
        parentId: Types.ObjectId | null;
        path: string;
        slug: string;
        title: string;
        description: string;
        kind: "branch" | "family";
        status?: string;
        sortOrder?: number;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    updateById(id: Types.ObjectId, patch: Partial<{
        slug: string;
        path: string;
        title: string;
        description: string;
        kind: "branch" | "family";
        status: string;
        sortOrder: number;
        parentId: Types.ObjectId | null;
        activeSpecSchemaId: Types.ObjectId | null;
        publishedAt: Date | null;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    deleteById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    findDescendantsByPathPrefix(prefix: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    findSelfAndDescendants(rootPath: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, CatalogCategoryDocument, {}, {}> & {
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
    setSortOrders(pairs: Array<{
        id: Types.ObjectId;
        sortOrder: number;
    }>, opts?: ExecOpts): Promise<void>;
    rewriteSubtreePaths(oldRootPath: string, newRootPath: string, opts?: ExecOpts): Promise<void>;
}
//# sourceMappingURL=category.repository.d.ts.map
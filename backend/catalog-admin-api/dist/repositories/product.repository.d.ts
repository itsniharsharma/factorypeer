import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export type ProductListFilter = {
    status?: string;
    /** Case-insensitive substring on title or slug */
    q?: string;
    sort?: "title" | "-title" | "updatedAt" | "-updatedAt" | "sortOrder";
    /** Products whose categoryIds contains this id */
    categoryId?: Types.ObjectId;
};
export declare class ProductRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    findById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findBySlug(slug: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Product list search: title, slug, searchText, and any variant with matching sku / itemNumber / mpn.
     */
    private buildListFilter;
    list(skip?: number, limit?: number, filter?: ProductListFilter, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    count(filter?: ProductListFilter, opts?: ExecOpts): Promise<number>;
    create(data: {
        slug: string;
        title: string;
        brand?: string;
        status?: string;
        categoryIds?: Types.ObjectId[];
        searchText?: string;
        sortOrder?: number;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateById(id: Types.ObjectId, patch: Partial<{
        slug: string;
        title: string;
        brand: string | null;
        status: string;
        categoryIds: Types.ObjectId[];
        searchText: string;
        sortOrder: number;
        defaultVariantId: Types.ObjectId | null;
        publishedAt: Date | null;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=product.repository.d.ts.map
import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export type VariantListFilter = {
    status?: string;
    q?: string;
};
export declare class ProductVariantRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    findById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        leadTime: string;
        packaging: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        moq?: number | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * One published variant per product (lowest sortOrder, then SKU) for storefront cards.
     */
    firstPublishedVariantPerProduct(productIds: Types.ObjectId[], opts?: ExecOpts): Promise<Map<string, Record<string, unknown>>>;
    listByProduct(productId: Types.ObjectId, opts?: ExecOpts & VariantListFilter & {
        skip?: number;
        limit?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        leadTime: string;
        packaging: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        moq?: number | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    countByProduct(productId: Types.ObjectId, opts?: ExecOpts & VariantListFilter): Promise<number>;
    create(data: {
        productId: Types.ObjectId;
        sku: string;
        itemNumber?: string;
        mpn?: string;
        manufacturer?: string;
        unitPrice?: string;
        currency?: string;
        availability?: string;
        uom?: string;
        leadTime?: string;
        moq?: number | null;
        packaging?: string;
        status?: string;
        specRowId?: Types.ObjectId | null;
        searchBlob?: string;
        sortOrder?: number;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        leadTime: string;
        packaging: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        moq?: number | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateById(id: Types.ObjectId, patch: Partial<{
        sku: string;
        itemNumber: string | null;
        mpn: string | null;
        manufacturer: string | null;
        unitPrice: string;
        currency: string;
        availability: string;
        uom: string | null;
        leadTime: string | null;
        moq: number | null;
        packaging: string | null;
        status: string;
        specRowId: Types.ObjectId | null;
        searchBlob: string;
        sortOrder: number;
        publishedAt: Date | null;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        leadTime: string;
        packaging: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        moq?: number | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        leadTime: string;
        packaging: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        moq?: number | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteByProduct(productId: Types.ObjectId, opts?: ExecOpts): Promise<void>;
    clearSpecRowLink(specRowId: Types.ObjectId, opts?: ExecOpts): Promise<void>;
}
//# sourceMappingURL=product-variant.repository.d.ts.map
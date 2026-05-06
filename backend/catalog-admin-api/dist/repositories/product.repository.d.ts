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
    /** Exact product ids (e.g. PDP cross-sell batch fetch). When set, full-text q is ignored. */
    ids?: Types.ObjectId[];
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
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /** Batch load by id (storefront spec matrix — avoids N product lookups). */
    findByIds(ids: Types.ObjectId[], opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBySlug(slug: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
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
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
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
        media?: Array<{
            url: string;
            alt?: string;
            sortOrder?: number;
        }>;
        longDescription?: string;
        features?: string[];
        applications?: string[];
        marketingBullets?: string[];
        attachments?: Array<{
            title: string;
            url: string;
            docType?: string;
            sortOrder?: number;
        }>;
        relatedProductIds?: Types.ObjectId[];
        compatibleProductIds?: Types.ObjectId[];
        recommendedProductIds?: Types.ObjectId[];
        shippingWeight?: string;
        branchAvailabilityPlaceholder?: string;
        logisticsMeta?: Array<{
            label: string;
            value: string;
        }>;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
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
        media: Array<{
            url: string;
            alt?: string;
            sortOrder?: number;
        }>;
        longDescription: string | null;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Array<{
            title: string;
            url: string;
            docType?: string;
            sortOrder?: number;
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        shippingWeight?: string | null;
        branchAvailabilityPlaceholder?: string | null;
        logisticsMeta?: Array<{
            label: string;
            value: string;
        }> | null;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        categoryIds: Types.ObjectId[];
        searchText: string;
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
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
        media: Types.DocumentArray<{
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }> & {
            url: string;
            sortOrder: number;
            publicId?: string | null | undefined;
            alt?: string | null | undefined;
            width
            /** Batch load by id (storefront spec matrix — avoids N product lookups). */
            ? /** Batch load by id (storefront spec matrix — avoids N product lookups). */: number | null | undefined;
            height?: number | null | undefined;
            format?: string | null | undefined;
        }>;
        longDescription: string;
        features: string[];
        applications: string[];
        marketingBullets: string[];
        attachments: Types.DocumentArray<{
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }> & {
            url: string;
            title: string;
            sortOrder: number;
            docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
        }>;
        relatedProductIds: Types.ObjectId[];
        compatibleProductIds: Types.ObjectId[];
        recommendedProductIds: Types.ObjectId[];
        logisticsMeta: Types.DocumentArray<{
            label: string;
            value: string;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            label: string;
            value: string;
        }> & {
            label: string;
            value: string;
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        brand?: string | null | undefined;
        defaultVariantId?: Types.ObjectId | null | undefined;
        shippingWeight?: string | null | undefined;
        branchAvailabilityPlaceholder?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=product.repository.d.ts.map
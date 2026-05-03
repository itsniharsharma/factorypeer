import type { Types } from "mongoose";
import type { ProductRepository, ProductListFilter } from "../repositories/product.repository.js";
import type { ProductVariantRepository, VariantListFilter } from "../repositories/product-variant.repository.js";
import type { SpecRowRepository } from "../repositories/spec-row.repository.js";
import type { WriteContext } from "../types/write-context.js";
export declare class ProductService {
    private readonly products;
    private readonly variants;
    private readonly specRows;
    constructor(products: ProductRepository, variants: ProductVariantRepository, specRows: SpecRowRepository);
    list(skip?: number, limit?: number, filter?: ProductListFilter, ctx?: WriteContext): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
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
        })[];
        total: number;
    }>;
    /** Storefront: resolve a variant to its parent product (slug, title) for spec matrix links. */
    getVariantWithProduct(variantId: string, ctx?: WriteContext): Promise<{
        variant: {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            documentVersion: number;
            productId: Types.ObjectId;
            sku: string;
            unitPrice: string;
            currency: string;
            availability: string;
            searchBlob: string;
            tenantId?: Types.ObjectId | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            createdBy?: Types.ObjectId | null | undefined;
            updatedBy?: Types.ObjectId | null | undefined;
            itemNumber?: string | null | undefined;
            mpn?: string | null | undefined;
            manufacturer?: string | null | undefined;
            uom?: string | null | undefined;
            specRowId?: Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        product: {
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
        };
    }>;
    getProduct(id: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
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
    }>;
    createProduct(input: {
        slug: string;
        title: string;
        brand?: string;
        status?: string;
        categoryIds?: string[];
        searchText?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
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
    updateProduct(id: string, patch: {
        slug?: string;
        title?: string;
        brand?: string | null;
        status?: string;
        categoryIds?: string[];
        searchText?: string;
        sortOrder?: number;
        defaultVariantId?: string | null;
    }, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
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
    }>;
    deleteProduct(id: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductDocument, {}, {}> & {
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
    listVariants(productId: string, ctx?: WriteContext, opts?: VariantListFilter & {
        skip?: number;
        limit?: number;
    }): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            documentVersion: number;
            productId: Types.ObjectId;
            sku: string;
            unitPrice: string;
            currency: string;
            availability: string;
            searchBlob: string;
            tenantId?: Types.ObjectId | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            createdBy?: Types.ObjectId | null | undefined;
            updatedBy?: Types.ObjectId | null | undefined;
            itemNumber?: string | null | undefined;
            mpn?: string | null | undefined;
            manufacturer?: string | null | undefined;
            uom?: string | null | undefined;
            specRowId?: Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    createVariant(productId: string, input: {
        sku: string;
        itemNumber?: string;
        mpn?: string;
        manufacturer?: string;
        unitPrice?: string;
        currency?: string;
        availability?: string;
        uom?: string;
        status?: string;
        specRowId?: string | null;
        searchBlob?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateVariant(variantId: string, patch: {
        sku?: string;
        itemNumber?: string | null;
        mpn?: string | null;
        manufacturer?: string | null;
        unitPrice?: string;
        currency?: string;
        availability?: string;
        uom?: string | null;
        status?: string;
        specRowId?: string | null;
        searchBlob?: string;
        sortOrder?: number;
    }, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteVariant(variantId: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Links a variant to a matrix row and optionally merges into row.variantBindings.
     */
    linkVariantToRow(variantId: string, input: {
        specRowId: string;
        syncBindings?: boolean;
        bindingRole?: "primary" | "alternate";
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").ProductVariantDocument, {}, {}> & {
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        productId: Types.ObjectId;
        sku: string;
        unitPrice: string;
        currency: string;
        availability: string;
        searchBlob: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        itemNumber?: string | null | undefined;
        mpn?: string | null | undefined;
        manufacturer?: string | null | undefined;
        uom?: string | null | undefined;
        specRowId?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=product.service.d.ts.map
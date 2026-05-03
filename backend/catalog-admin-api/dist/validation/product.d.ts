import { z } from "zod";
export declare const createProductBodySchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    searchText: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>, "many">>;
    longDescription: z.ZodOptional<z.ZodString>;
    features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    applications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    marketingBullets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        docType: z.ZodOptional<z.ZodEnum<["manual", "datasheet", "sds", "certification", "drawing", "other"]>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }, {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }>, "many">>;
    relatedProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    compatibleProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    recommendedProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    shippingWeight: z.ZodOptional<z.ZodString>;
    branchAvailabilityPlaceholder: z.ZodOptional<z.ZodString>;
    logisticsMeta: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    media?: {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }[] | undefined;
    longDescription?: string | undefined;
    features?: string[] | undefined;
    applications?: string[] | undefined;
    marketingBullets?: string[] | undefined;
    attachments?: {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    compatibleProductIds?: string[] | undefined;
    recommendedProductIds?: string[] | undefined;
    logisticsMeta?: {
        value: string;
        label: string;
    }[] | undefined;
    brand?: string | undefined;
    shippingWeight?: string | undefined;
    branchAvailabilityPlaceholder?: string | undefined;
}, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    media?: {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }[] | undefined;
    longDescription?: string | undefined;
    features?: string[] | undefined;
    applications?: string[] | undefined;
    marketingBullets?: string[] | undefined;
    attachments?: {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    compatibleProductIds?: string[] | undefined;
    recommendedProductIds?: string[] | undefined;
    logisticsMeta?: {
        value: string;
        label: string;
    }[] | undefined;
    brand?: string | undefined;
    shippingWeight?: string | undefined;
    branchAvailabilityPlaceholder?: string | undefined;
}>;
export declare const updateProductBodySchema: z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    brand: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    searchText: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    defaultVariantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>, "many">>;
    longDescription: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    applications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    marketingBullets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        docType: z.ZodOptional<z.ZodEnum<["manual", "datasheet", "sds", "certification", "drawing", "other"]>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }, {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }>, "many">>;
    relatedProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    compatibleProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    recommendedProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    shippingWeight: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    branchAvailabilityPlaceholder: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    logisticsMeta: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    media?: {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }[] | undefined;
    longDescription?: string | null | undefined;
    features?: string[] | undefined;
    applications?: string[] | undefined;
    marketingBullets?: string[] | undefined;
    attachments?: {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    compatibleProductIds?: string[] | undefined;
    recommendedProductIds?: string[] | undefined;
    logisticsMeta?: {
        value: string;
        label: string;
    }[] | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: string | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    media?: {
        url: string;
        sortOrder?: number | undefined;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }[] | undefined;
    longDescription?: string | null | undefined;
    features?: string[] | undefined;
    applications?: string[] | undefined;
    marketingBullets?: string[] | undefined;
    attachments?: {
        title: string;
        url: string;
        sortOrder?: number | undefined;
        docType?: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other" | undefined;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    compatibleProductIds?: string[] | undefined;
    recommendedProductIds?: string[] | undefined;
    logisticsMeta?: {
        value: string;
        label: string;
    }[] | null | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: string | null | undefined;
    shippingWeight?: string | null | undefined;
    branchAvailabilityPlaceholder?: string | null | undefined;
}>;
export declare const createVariantBodySchema: z.ZodObject<{
    sku: z.ZodString;
    itemNumber: z.ZodOptional<z.ZodString>;
    mpn: z.ZodOptional<z.ZodString>;
    manufacturer: z.ZodOptional<z.ZodString>;
    unitPrice: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodString>;
    uom: z.ZodOptional<z.ZodString>;
    leadTime: z.ZodOptional<z.ZodString>;
    moq: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    packaging: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    specRowId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    searchBlob: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sku: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    leadTime?: string | undefined;
    packaging?: string | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | undefined;
    mpn?: string | undefined;
    manufacturer?: string | undefined;
    uom?: string | undefined;
    moq?: number | null | undefined;
    specRowId?: string | null | undefined;
}, {
    sku: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    leadTime?: string | undefined;
    packaging?: string | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | undefined;
    mpn?: string | undefined;
    manufacturer?: string | undefined;
    uom?: string | undefined;
    moq?: number | null | undefined;
    specRowId?: string | null | undefined;
}>;
export declare const updateVariantBodySchema: z.ZodObject<{
    sku: z.ZodOptional<z.ZodString>;
    itemNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mpn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    manufacturer: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    unitPrice: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodString>;
    uom: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    leadTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    moq: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    packaging: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    specRowId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    searchBlob: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    sku?: string | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    leadTime?: string | null | undefined;
    packaging?: string | null | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: string | null | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    sku?: string | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    leadTime?: string | null | undefined;
    packaging?: string | null | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    moq?: number | null | undefined;
    specRowId?: string | null | undefined;
}>;
export declare const linkVariantToRowBodySchema: z.ZodObject<{
    specRowId: z.ZodString;
    /** When true (default), append binding on row and set variant.specRowId */
    syncBindings: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    bindingRole: z.ZodDefault<z.ZodOptional<z.ZodEnum<["primary", "alternate"]>>>;
}, "strip", z.ZodTypeAny, {
    specRowId: string;
    syncBindings: boolean;
    bindingRole: "primary" | "alternate";
}, {
    specRowId: string;
    syncBindings?: boolean | undefined;
    bindingRole?: "primary" | "alternate" | undefined;
}>;
export declare const productIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const variantIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=product.d.ts.map
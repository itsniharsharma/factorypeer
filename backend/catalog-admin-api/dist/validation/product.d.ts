import { z } from "zod";
export declare const createProductBodySchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    searchText: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    brand?: string | undefined;
}, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    brand?: string | undefined;
}>;
export declare const updateProductBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    brand: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    searchText: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    defaultVariantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: string | null | undefined;
}, {
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: string | null | undefined;
}>, {
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: string | null | undefined;
}, {
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryIds?: string[] | undefined;
    searchText?: string | undefined;
    brand?: string | null | undefined;
    defaultVariantId?: string | null | undefined;
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
    searchBlob?: string | undefined;
    itemNumber?: string | undefined;
    mpn?: string | undefined;
    manufacturer?: string | undefined;
    uom?: string | undefined;
    specRowId?: string | null | undefined;
}, {
    sku: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | undefined;
    mpn?: string | undefined;
    manufacturer?: string | undefined;
    uom?: string | undefined;
    specRowId?: string | null | undefined;
}>;
export declare const updateVariantBodySchema: z.ZodEffects<z.ZodObject<{
    sku: z.ZodOptional<z.ZodString>;
    itemNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mpn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    manufacturer: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    unitPrice: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodString>;
    uom: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    searchBlob?: string | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    specRowId?: string | null | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    sku?: string | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    specRowId?: string | null | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    sku?: string | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
    specRowId?: string | null | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    sku?: string | undefined;
    unitPrice?: string | undefined;
    currency?: string | undefined;
    availability?: string | undefined;
    searchBlob?: string | undefined;
    itemNumber?: string | null | undefined;
    mpn?: string | null | undefined;
    manufacturer?: string | null | undefined;
    uom?: string | null | undefined;
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
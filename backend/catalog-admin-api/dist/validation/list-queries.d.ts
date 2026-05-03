import { z } from "zod";
/** Storefront PDP relation grids — comma-separated product ids (required). */
export declare const productSummaryCardsQuerySchema: z.ZodEffects<z.ZodObject<{
    ids: z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[] | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    ids?: string[] | undefined;
}, {
    ids?: unknown;
}>, {
    ids?: string[] | undefined;
}, {
    ids?: unknown;
}>;
export declare const productListQuerySchema: z.ZodObject<{
    skip: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    q: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodEnum<["title", "-title", "updatedAt", "-updatedAt", "sortOrder"]>>;
    /** Restrict to products tagged with this catalog category (Mongo ObjectId). */
    categoryId: z.ZodOptional<z.ZodString>;
    /** Comma-separated product ObjectIds (e.g. related-item resolution on storefront). */
    ids: z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[] | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    sort?: "title" | "sortOrder" | "updatedAt" | "-title" | "-updatedAt" | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    limit?: number | undefined;
    skip?: number | undefined;
    ids?: string[] | undefined;
    categoryId?: string | undefined;
    q?: string | undefined;
}, {
    sort?: "title" | "sortOrder" | "updatedAt" | "-title" | "-updatedAt" | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    limit?: number | undefined;
    skip?: number | undefined;
    ids?: unknown;
    categoryId?: string | undefined;
    q?: string | undefined;
}>;
export declare const specRowListQuerySchema: z.ZodObject<{
    skip: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    limit?: number | undefined;
    skip?: number | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    limit?: number | undefined;
    skip?: number | undefined;
}>;
export declare const variantListQuerySchema: z.ZodObject<{
    skip: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    limit?: number | undefined;
    skip?: number | undefined;
    q?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    limit?: number | undefined;
    skip?: number | undefined;
    q?: string | undefined;
}>;
export declare const categoryChildrenQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
//# sourceMappingURL=list-queries.d.ts.map
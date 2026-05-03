import { z } from "zod";
export declare const createCategoryBodySchema: z.ZodObject<{
    parentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    kind: z.ZodEnum<["branch", "family"]>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description: string;
    slug: string;
    title: string;
    kind: "family" | "branch";
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    parentId?: string | null | undefined;
}, {
    slug: string;
    title: string;
    kind: "family" | "branch";
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    parentId?: string | null | undefined;
}>;
export declare const updateCategoryBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodOptional<z.ZodEnum<["branch", "family"]>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    kind?: "family" | "branch" | undefined;
    sortOrder?: number | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    kind?: "family" | "branch" | undefined;
    sortOrder?: number | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    kind?: "family" | "branch" | undefined;
    sortOrder?: number | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    kind?: "family" | "branch" | undefined;
    sortOrder?: number | undefined;
}>;
export declare const moveCategoryBodySchema: z.ZodObject<{
    newParentId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    newParentId: string | null;
}, {
    newParentId: string | null;
}>;
export declare const reorderSiblingsBodySchema: z.ZodObject<{
    orderedIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    orderedIds: string[];
}, {
    orderedIds: string[];
}>;
export declare const attachSpecSchemaBodySchema: z.ZodObject<{
    specSchemaId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    specSchemaId: string;
}, {
    specSchemaId: string;
}>;
export declare const categoryIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const setCategoryKindBodySchema: z.ZodObject<{
    kind: z.ZodEnum<["branch", "family"]>;
}, "strip", z.ZodTypeAny, {
    kind: "family" | "branch";
}, {
    kind: "family" | "branch";
}>;
//# sourceMappingURL=category.d.ts.map
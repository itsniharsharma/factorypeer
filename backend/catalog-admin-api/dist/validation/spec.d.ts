import { z } from "zod";
export declare const createSpecSchemaBodySchema: z.ZodObject<{
    familySummary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    familySummary: string;
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    familySummary?: string | undefined;
}>;
export declare const updateSpecSchemaBodySchema: z.ZodEffects<z.ZodObject<{
    familySummary: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    familySummary?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    familySummary?: string | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    familySummary?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    familySummary?: string | undefined;
}>;
export declare const createSpecColumnBodySchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    dataType: z.ZodOptional<z.ZodEnum<["string", "number", "boolean", "enum", "dimension"]>>;
    filterable: z.ZodOptional<z.ZodBoolean>;
    sortable: z.ZodOptional<z.ZodBoolean>;
    searchIndex: z.ZodOptional<z.ZodBoolean>;
    enumOptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    unit: z.ZodOptional<z.ZodString>;
    widthClass: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    key: string;
    label: string;
    sortOrder?: number | undefined;
    dataType?: "string" | "number" | "boolean" | "enum" | "dimension" | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    searchIndex?: boolean | undefined;
    enumOptions?: string[] | undefined;
    unit?: string | undefined;
    widthClass?: string | undefined;
}, {
    key: string;
    label: string;
    sortOrder?: number | undefined;
    dataType?: "string" | "number" | "boolean" | "enum" | "dimension" | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    searchIndex?: boolean | undefined;
    enumOptions?: string[] | undefined;
    unit?: string | undefined;
    widthClass?: string | undefined;
}>;
export declare const updateSpecColumnBodySchema: z.ZodEffects<z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    dataType: z.ZodOptional<z.ZodEnum<["string", "number", "boolean", "enum", "dimension"]>>;
    filterable: z.ZodOptional<z.ZodBoolean>;
    sortable: z.ZodOptional<z.ZodBoolean>;
    searchIndex: z.ZodOptional<z.ZodBoolean>;
    enumOptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    unit: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    widthClass: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sortOrder?: number | undefined;
    label?: string | undefined;
    dataType?: "string" | "number" | "boolean" | "enum" | "dimension" | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    searchIndex?: boolean | undefined;
    enumOptions?: string[] | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
}, {
    sortOrder?: number | undefined;
    label?: string | undefined;
    dataType?: "string" | "number" | "boolean" | "enum" | "dimension" | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    searchIndex?: boolean | undefined;
    enumOptions?: string[] | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
}>, {
    sortOrder?: number | undefined;
    label?: string | undefined;
    dataType?: "string" | "number" | "boolean" | "enum" | "dimension" | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    searchIndex?: boolean | undefined;
    enumOptions?: string[] | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
}, {
    sortOrder?: number | undefined;
    label?: string | undefined;
    dataType?: "string" | "number" | "boolean" | "enum" | "dimension" | undefined;
    filterable?: boolean | undefined;
    sortable?: boolean | undefined;
    searchIndex?: boolean | undefined;
    enumOptions?: string[] | undefined;
    unit?: string | null | undefined;
    widthClass?: string | null | undefined;
}>;
export declare const createSpecRowBodySchema: z.ZodObject<{
    values: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    variantBindings: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        productVariantId: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["primary", "alternate"]>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }, {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }>, "many">>>;
    externalKey: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    values: Record<string, string>;
    variantBindings: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[];
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    externalKey?: string | undefined;
}, {
    values?: Record<string, string> | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    variantBindings?: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[] | undefined;
    externalKey?: string | undefined;
}>;
export declare const updateSpecRowBodySchema: z.ZodEffects<z.ZodObject<{
    values: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    variantBindings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        productVariantId: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["primary", "alternate"]>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }, {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }>, "many">>;
    externalKey: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    values?: Record<string, string> | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    variantBindings?: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[] | undefined;
    externalKey?: string | null | undefined;
}, {
    values?: Record<string, string> | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    variantBindings?: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[] | undefined;
    externalKey?: string | null | undefined;
}>, {
    values?: Record<string, string> | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    variantBindings?: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[] | undefined;
    externalKey?: string | null | undefined;
}, {
    values?: Record<string, string> | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    variantBindings?: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[] | undefined;
    externalKey?: string | null | undefined;
}>;
export declare const setRowBindingsBodySchema: z.ZodObject<{
    bindings: z.ZodArray<z.ZodObject<{
        productVariantId: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["primary", "alternate"]>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }, {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    bindings: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[];
}, {
    bindings: {
        productVariantId: string;
        sortOrder?: number | undefined;
        role?: "primary" | "alternate" | undefined;
    }[];
}>;
export declare const reorderRowsBodySchema: z.ZodObject<{
    orderedIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    orderedIds: string[];
}, {
    orderedIds: string[];
}>;
export declare const specSchemaIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const specColumnIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const specRowIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const taxonomySpecSchemaParamsSchema: z.ZodObject<{
    categoryId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    categoryId: string;
}, {
    categoryId: string;
}>;
//# sourceMappingURL=spec.d.ts.map
import { z } from "zod";
import { objectIdString, publishStatusSchema, specColumnDataTypeSchema, variantBindingRoleSchema, } from "./common.js";
export const createSpecSchemaBodySchema = z.object({
    familySummary: z.string().max(20000).optional().default(""),
    status: publishStatusSchema.optional(),
});
export const updateSpecSchemaBodySchema = z
    .object({
    familySummary: z.string().max(20000).optional(),
    status: publishStatusSchema.optional(),
})
    .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });
export const createSpecColumnBodySchema = z.object({
    key: z.string().min(1).max(120).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Use camelCase key"),
    label: z.string().min(1).max(500),
    dataType: specColumnDataTypeSchema.optional(),
    filterable: z.boolean().optional(),
    sortable: z.boolean().optional(),
    searchIndex: z.boolean().optional(),
    enumOptions: z.array(z.string()).optional(),
    unit: z.string().max(50).optional(),
    widthClass: z.string().max(50).optional(),
    sortOrder: z.number().int().optional(),
});
export const updateSpecColumnBodySchema = z
    .object({
    label: z.string().min(1).max(500).optional(),
    dataType: specColumnDataTypeSchema.optional(),
    filterable: z.boolean().optional(),
    sortable: z.boolean().optional(),
    searchIndex: z.boolean().optional(),
    enumOptions: z.array(z.string()).optional(),
    unit: z.string().max(50).optional().nullable(),
    widthClass: z.string().max(50).optional().nullable(),
    sortOrder: z.number().int().optional(),
})
    .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });
export const createSpecRowBodySchema = z.object({
    values: z.record(z.string()).default({}),
    variantBindings: z
        .array(z.object({
        productVariantId: objectIdString,
        role: variantBindingRoleSchema.optional(),
        sortOrder: z.number().int().optional(),
    }))
        .optional()
        .default([]),
    externalKey: z.string().max(500).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
});
export const updateSpecRowBodySchema = z
    .object({
    values: z.record(z.string()).optional(),
    variantBindings: z
        .array(z.object({
        productVariantId: objectIdString,
        role: variantBindingRoleSchema.optional(),
        sortOrder: z.number().int().optional(),
    }))
        .optional(),
    externalKey: z.string().max(500).optional().nullable(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
})
    .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });
export const setRowBindingsBodySchema = z.object({
    bindings: z
        .array(z.object({
        productVariantId: objectIdString,
        role: variantBindingRoleSchema.optional(),
        sortOrder: z.number().int().optional(),
    }))
        .min(0),
});
export const reorderRowsBodySchema = z.object({
    orderedIds: z.array(objectIdString).min(1),
});
export const specSchemaIdParamsSchema = z.object({
    id: objectIdString,
});
export const specColumnIdParamsSchema = z.object({
    id: objectIdString,
});
export const specRowIdParamsSchema = z.object({
    id: objectIdString,
});
export const taxonomySpecSchemaParamsSchema = z.object({
    categoryId: objectIdString,
});

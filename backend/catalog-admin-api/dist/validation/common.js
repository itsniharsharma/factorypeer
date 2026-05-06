import { z } from "zod";
export const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
export const publishStatusSchema = z.enum(["draft", "published", "archived"]);
export const catalogCategoryKindSchema = z.enum(["branch", "family"]);
export const variantBindingRoleSchema = z.enum(["primary", "alternate"]);
export const specColumnDataTypeSchema = z.enum([
    "string",
    "number",
    "boolean",
    "enum",
    "dimension",
]);
export const catalogMediaAssetSchema = z.object({
    url: z.string().url().min(1),
    publicId: z.string().min(1).optional(),
    alt: z.string().max(500).optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    format: z.string().max(20).optional(),
});

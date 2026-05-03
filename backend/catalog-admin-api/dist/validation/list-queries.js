import { z } from "zod";
import { objectIdString, publishStatusSchema } from "./common.js";
const paginationQuery = z.object({
    skip: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
});
export const productListQuerySchema = paginationQuery.extend({
    status: publishStatusSchema.optional(),
    q: z.string().max(200).optional(),
    sort: z.enum(["title", "-title", "updatedAt", "-updatedAt", "sortOrder"]).optional(),
    /** Restrict to products tagged with this catalog category (Mongo ObjectId). */
    categoryId: objectIdString.optional(),
});
export const specRowListQuerySchema = paginationQuery.extend({
    status: publishStatusSchema.optional(),
});
export const variantListQuerySchema = paginationQuery.extend({
    status: publishStatusSchema.optional(),
    q: z.string().max(120).optional(),
});
export const categoryChildrenQuerySchema = z.object({
    status: publishStatusSchema.optional(),
});

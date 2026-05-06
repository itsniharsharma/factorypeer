import { z } from "zod";
import { objectIdString, publishStatusSchema } from "./common.js";
const paginationQuery = z.object({
    skip: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
});
const idListFromComma = z.preprocess((raw) => {
    if (raw == null || raw === "")
        return undefined;
    if (typeof raw !== "string")
        return undefined;
    const p = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 100);
    return p.length ? p : undefined;
}, z.array(objectIdString).optional());
/** Storefront PDP relation grids — comma-separated product ids (required). */
export const productSummaryCardsQuerySchema = z
    .object({
    ids: idListFromComma,
})
    .refine((o) => (o.ids?.length ?? 0) > 0, { message: "ids query required", path: ["ids"] });
/** Spec matrix: resolve many variant bindings in one round-trip (large families). */
const variantIdListFromComma = z.preprocess((raw) => {
    if (raw == null || raw === "")
        return undefined;
    if (typeof raw !== "string")
        return undefined;
    const p = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 500);
    return p.length ? p : undefined;
}, z.array(objectIdString).optional());
export const variantBundlesQuerySchema = z
    .object({
    ids: variantIdListFromComma,
})
    .refine((o) => (o.ids?.length ?? 0) > 0, { message: "ids query required", path: ["ids"] });
export const productListQuerySchema = paginationQuery.extend({
    status: publishStatusSchema.optional(),
    q: z.string().max(200).optional(),
    sort: z.enum(["title", "-title", "updatedAt", "-updatedAt", "sortOrder"]).optional(),
    /** Restrict to products tagged with this catalog category (Mongo ObjectId). */
    categoryId: objectIdString.optional(),
    /** Comma-separated product ObjectIds (e.g. related-item resolution on storefront). */
    ids: idListFromComma,
});
/** Spec rows: higher limit than generic pagination — storefront chunks full-schema reads for PDP. */
export const specRowListQuerySchema = z.object({
    skip: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(5000).optional(),
    status: publishStatusSchema.optional(),
});
export const variantListQuerySchema = paginationQuery.extend({
    status: publishStatusSchema.optional(),
    q: z.string().max(120).optional(),
});
export const categoryChildrenQuerySchema = z.object({
    status: publishStatusSchema.optional(),
});

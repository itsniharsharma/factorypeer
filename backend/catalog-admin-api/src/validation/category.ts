import { z } from "zod";
import {
  catalogCategoryKindSchema,
  objectIdString,
  publishStatusSchema,
} from "./common.js";

export const createCategoryBodySchema = z.object({
  parentId: objectIdString.nullable().optional(),
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional().default(""),
  kind: catalogCategoryKindSchema,
  status: publishStatusSchema.optional(),
  sortOrder: z.number().int().optional(),
});

export const updateCategoryBodySchema = z
  .object({
    slug: z.string().min(1).max(200).optional(),
    title: z.string().min(1).max(500).optional(),
    description: z.string().max(10000).optional(),
    kind: catalogCategoryKindSchema.optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const moveCategoryBodySchema = z.object({
  newParentId: objectIdString.nullable(),
});

export const reorderSiblingsBodySchema = z.object({
  orderedIds: z.array(objectIdString).min(1),
});

export const attachSpecSchemaBodySchema = z.object({
  specSchemaId: objectIdString,
});

export const categoryIdParamsSchema = z.object({
  id: objectIdString,
});

export const setCategoryKindBodySchema = z.object({
  kind: catalogCategoryKindSchema,
});

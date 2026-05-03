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

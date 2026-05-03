import { z } from "zod";
import { AppError } from "../errors/app-error.js";

export function parseBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const r = schema.safeParse(body);
  if (!r.success) {
    const flat = r.error.flatten();
    const fieldMsg =
      Object.keys(flat.fieldErrors).length > 0 ? JSON.stringify(flat.fieldErrors) : "";
    const formMsg =
      flat.formErrors?.length > 0 ? flat.formErrors.join("; ") : "";
    const msg =
      fieldMsg ||
      formMsg ||
      r.error.message ||
      JSON.stringify(r.error.format());
    throw new AppError(msg || "Validation failed", 422, "VALIDATION_ERROR");
  }
  return r.data;
}

export function parseParams<T>(schema: z.ZodSchema<T>, params: Record<string, string | undefined>): T {
  const r = schema.safeParse(params);
  if (!r.success) {
    throw new AppError(r.error.message, 422, "VALIDATION_ERROR");
  }
  return r.data;
}

export function parseQuery<T>(schema: z.ZodSchema<T>, query: Record<string, string | string[] | undefined>): T {
  const r = schema.safeParse(query);
  if (!r.success) {
    const msg = r.error.flatten().fieldErrors
      ? JSON.stringify(r.error.flatten().fieldErrors)
      : r.error.message;
    throw new AppError(msg, 422, "VALIDATION_ERROR");
  }
  return r.data;
}

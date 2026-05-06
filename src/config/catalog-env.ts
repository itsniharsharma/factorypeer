/**
 * Server-only validated config for catalog upstream URL (Next.js + Route Handlers).
 */
import { z } from "zod";

const schema = z.object({
  CATALOG_ADMIN_API_URL: z
    .string()
    .optional()
    .transform((s) => (s?.trim() ? s.trim().replace(/\/$/, "") : undefined)),
});

function parse(): z.infer<typeof schema> {
  return schema.parse({
    CATALOG_ADMIN_API_URL: process.env["CATALOG_ADMIN_API_URL"],
  });
}

let memo: z.infer<typeof schema> | undefined;

/** Normalized base URL for catalog-admin-api (no trailing slash). */
export function getCatalogAdminApiBaseUrl(): string {
  if (!memo) memo = parse();
  if (memo.CATALOG_ADMIN_API_URL) return memo.CATALOG_ADMIN_API_URL;
  if (process.env["NODE_ENV"] === "production") {
    throw new Error(
      "Missing CATALOG_ADMIN_API_URL in production. Set it to your catalog-admin-api HTTPS URL.",
    );
  }
  return "http://127.0.0.1:4040";
}

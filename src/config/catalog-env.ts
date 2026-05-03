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
  return memo.CATALOG_ADMIN_API_URL ?? "http://127.0.0.1:4040";
}

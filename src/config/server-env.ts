import "server-only";

import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .optional()
  .transform((value) => (value?.trim() ? value.trim() : undefined));

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CATALOG_ADMIN_API_URL: optionalTrimmedString.transform((value) => (value ? value.replace(/\/$/, "") : undefined)),
  CATALOG_ADMIN_API_KEY: optionalTrimmedString,
  NEXT_ADMIN_TOKEN: optionalTrimmedString,
  UPSTASH_REDIS_REST_URL: optionalTrimmedString.transform((value) => (value ? value.replace(/\/$/, "") : undefined)),
  UPSTASH_REDIS_REST_TOKEN: optionalTrimmedString,
  FP_CATALOG_DEBUG: optionalTrimmedString,
  FP_CACHE_LOG: optionalTrimmedString,
  FP_TAXONOMY_DEBUG: optionalTrimmedString,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let memo: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (!memo) {
    memo = serverEnvSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      CATALOG_ADMIN_API_URL: process.env.CATALOG_ADMIN_API_URL,
      CATALOG_ADMIN_API_KEY: process.env.CATALOG_ADMIN_API_KEY,
      NEXT_ADMIN_TOKEN: process.env.NEXT_ADMIN_TOKEN,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      FP_CATALOG_DEBUG: process.env.FP_CATALOG_DEBUG,
      FP_CACHE_LOG: process.env.FP_CACHE_LOG,
      FP_TAXONOMY_DEBUG: process.env.FP_TAXONOMY_DEBUG,
    });
  }

  return memo;
}

export function isProduction(): boolean {
  return getServerEnv().NODE_ENV === "production";
}

export function getCatalogAdminApiBaseUrl(): string {
  const { CATALOG_ADMIN_API_URL } = getServerEnv();
  if (CATALOG_ADMIN_API_URL) return CATALOG_ADMIN_API_URL;
  if (isProduction()) {
    throw new Error("Missing CATALOG_ADMIN_API_URL in production.");
  }
  return "http://127.0.0.1:4040";
}

export function getCatalogAdminApiKey(): string | undefined {
  const { CATALOG_ADMIN_API_KEY } = getServerEnv();
  return CATALOG_ADMIN_API_KEY && CATALOG_ADMIN_API_KEY.length >= 16 ? CATALOG_ADMIN_API_KEY : undefined;
}

export function getAdminSessionToken(): string | undefined {
  const { NEXT_ADMIN_TOKEN } = getServerEnv();
  return NEXT_ADMIN_TOKEN && NEXT_ADMIN_TOKEN.length >= 16 ? NEXT_ADMIN_TOKEN : undefined;
}

export function getRedisConfig(): { baseUrl?: string; token?: string } {
  const env = getServerEnv();
  const token = env.UPSTASH_REDIS_REST_TOKEN && !env.UPSTASH_REDIS_REST_TOKEN.includes("REPLACE_WITH_YOUR_REAL_TOKEN")
    ? env.UPSTASH_REDIS_REST_TOKEN
    : undefined;

  return {
    baseUrl: env.UPSTASH_REDIS_REST_URL,
    token,
  };
}

export function isDebugEnabled(flag: "FP_CATALOG_DEBUG" | "FP_CACHE_LOG" | "FP_TAXONOMY_DEBUG"): boolean {
  const env = getServerEnv();
  return env.NODE_ENV !== "production" || env[flag] === "1";
}

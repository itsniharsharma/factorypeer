import { Types } from "mongoose";

function parseOptionalObjectId(envVal: string | undefined): Types.ObjectId | undefined {
  if (!envVal?.trim()) return undefined;
  if (!Types.ObjectId.isValid(envVal)) return undefined;
  return new Types.ObjectId(envVal);
}

export function loadConfig() {
  return {
    mongoUri: process.env["MONGODB_URI"] ?? "mongodb://127.0.0.1:27017/factorypeer_catalog",
    port: Number(process.env["PORT"] ?? 4040),
    host: process.env["HOST"] ?? "0.0.0.0",
    /** Single-tenant default; omit or set per request later. */
    defaultTenantId: parseOptionalObjectId(process.env["CATALOG_TENANT_ID"]),
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;

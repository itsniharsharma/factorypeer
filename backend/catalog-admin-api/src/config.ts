import { Types } from "mongoose";
import { z } from "zod";

function parseOptionalObjectId(envVal: string | undefined): Types.ObjectId | undefined {
  if (!envVal?.trim()) return undefined;
  if (!Types.ObjectId.isValid(envVal)) return undefined;
  return new Types.ObjectId(envVal);
}

const envSchema = z.object({
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/factorypeer_catalog"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4040),
  HOST: z.string().min(1).default("0.0.0.0"),
  CATALOG_TENANT_ID: z.string().optional(),
});

export function loadConfig() {
  const e = envSchema.parse(process.env);
  return {
    mongoUri: e.MONGODB_URI,
    port: e.PORT,
    host: e.HOST,
    defaultTenantId: parseOptionalObjectId(e.CATALOG_TENANT_ID),
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;

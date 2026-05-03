import mongoose from "mongoose";
import { registerCatalogModels, type CatalogRegisteredModels } from "@factorypeer/catalog-models";
import type { AppConfig } from "../config.js";
import type { ConnectOptions } from "mongoose";

export type CatalogModels = CatalogRegisteredModels;

/**
 * Atlas + Windows + Node 18+: the default "happy eyeballs" / IPv6-first path can pick a
 * route that fails during TLS, surfacing as ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR (alert 80).
 * Prefer IPv4 and disable auto family selection unless MONGODB_DNS_FAMILY=0|auto.
 */
function mongoConnectOptions(): ConnectOptions {
  const raw = process.env["MONGODB_DNS_FAMILY"]?.trim().toLowerCase();
  const opts: ConnectOptions = {
    serverSelectionTimeoutMS: 30_000,
  };
  if (raw === "0" || raw === "auto") {
    return opts;
  }
  if (raw === "6") {
    opts.family = 6;
    return opts;
  }
  opts.family = 4;
  opts.autoSelectFamily = false;
  return opts;
}

export async function connectMongo(config: AppConfig): Promise<CatalogModels> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri, mongoConnectOptions());

  return registerCatalogModels(mongoose);
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}

import mongoose from "mongoose";
import { registerCatalogModels } from "@factorypeer/catalog-models";
/**
 * Atlas + Windows + Node 18+: the default "happy eyeballs" / IPv6-first path can pick a
 * route that fails during TLS, surfacing as ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR (alert 80).
 * Prefer IPv4 and disable auto family selection unless MONGODB_DNS_FAMILY=0|auto.
 *
 * Production pools: 25-50 connections depending on concurrency.
 * Local dev: 5-10 to avoid resource exhaustion.
 */
function mongoConnectOptions() {
    const raw = process.env["MONGODB_DNS_FAMILY"]?.trim().toLowerCase();
    const isProd = process.env.NODE_ENV === "production";
    const opts = {
        serverSelectionTimeoutMS: isProd ? 30_000 : 10_000,
        socketTimeoutMS: isProd ? 45_000 : 30_000,
        connectTimeoutMS: isProd ? 30_000 : 10_000,
        // Connection pool sizing based on environment
        maxPoolSize: isProd ? 50 : 10,
        minPoolSize: isProd ? 10 : 2,
        maxIdleTimeMS: 45_000,
        // Automatic retry on temporary failures
        retryWrites: true,
        retryReads: true,
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
export async function connectMongo(config) {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.mongoUri, mongoConnectOptions());
    return registerCatalogModels(mongoose);
}
export async function disconnectMongo() {
    await mongoose.disconnect();
}

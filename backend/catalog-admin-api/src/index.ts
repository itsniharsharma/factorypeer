/**
 * Library entry — compose services without starting HTTP (tests / custom servers).
 */
export { loadConfig } from "./config.js";
export { connectMongo, disconnectMongo } from "./db/connection.js";
export type { CatalogModels } from "./db/connection.js";
export { createCatalogAdminServices } from "./composition-root.js";
export type { CatalogAdminServices } from "./composition-root.js";
export { buildApp } from "./app.js";
export { withTransaction } from "./db/with-transaction.js";
export { writeContext } from "./http/write-context.js";
export * from "./errors/app-error.js";
export * from "./errors/domain.js";
export * from "./repositories/index.js";
export * from "./services/index.js";

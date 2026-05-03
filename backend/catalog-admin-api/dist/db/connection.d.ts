import { type CatalogRegisteredModels } from "@factorypeer/catalog-models";
import type { AppConfig } from "../config.js";
export type CatalogModels = CatalogRegisteredModels;
export declare function connectMongo(config: AppConfig): Promise<CatalogModels>;
export declare function disconnectMongo(): Promise<void>;
//# sourceMappingURL=connection.d.ts.map
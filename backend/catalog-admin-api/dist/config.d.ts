import { Types } from "mongoose";
export declare function loadConfig(): {
    mongoUri: string;
    port: number;
    host: string;
    /** Single-tenant default; omit or set per request later. */
    defaultTenantId: Types.ObjectId | undefined;
};
export type AppConfig = ReturnType<typeof loadConfig>;
//# sourceMappingURL=config.d.ts.map
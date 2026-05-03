import { Types } from "mongoose";
export declare function loadConfig(): {
    mongoUri: string;
    port: number;
    host: string;
    defaultTenantId: Types.ObjectId | undefined;
    adminApiKey: string | undefined;
    logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent" | undefined;
};
export type AppConfig = ReturnType<typeof loadConfig>;
//# sourceMappingURL=config.d.ts.map
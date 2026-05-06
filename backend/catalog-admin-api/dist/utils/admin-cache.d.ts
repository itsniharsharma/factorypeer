type CacheScope = "category" | "homepage" | "navigation" | "product" | "search" | "supplier" | "taxonomy";
type CacheReadOptions<T> = {
    scope: CacheScope;
    key: string;
    ttlSeconds: number;
    staleWhileRevalidateSeconds?: number;
    loader: () => Promise<T>;
};
export declare function adminCacheAside<T>(opts: CacheReadOptions<T>): Promise<T>;
export {};
//# sourceMappingURL=admin-cache.d.ts.map
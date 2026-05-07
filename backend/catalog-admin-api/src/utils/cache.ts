type CacheScope =
  | "category"
  | "homepage"
  | "navigation"
  | "product"
  | "search"
  | "supplier"
  | "taxonomy";
import { isRedisConfigured, redisFetch } from "./redis-client.js";

async function redisGetVersion(scope: CacheScope): Promise<number> {
  if (!isRedisConfigured()) return 0;
  try {
    const res = await redisFetch(`get/fp%3Aversion%3A${scope}`);
    if (!res.ok) return 0;
    const payload = (await res.json()) as { result?: number };
    return typeof payload.result === "number" && Number.isFinite(payload.result) ? payload.result : 0;
  } catch {
    return 0;
  }
}

async function redisSetVersion(scope: CacheScope, version: number): Promise<void> {
  if (!isRedisConfigured()) return;
  try {
    await redisFetch(`set/fp%3Aversion%3A${scope}/${encodeURIComponent(String(version))}?ex=2592000`, {
      method: "POST",
    });
  } catch (err) {
    // Log but don't throw - invalidation failures should not break the API
    console.error("[cache] failed to set version for scope", scope, err instanceof Error ? err.message : err);
  }
}

export async function invalidateCatalogCache(scopes: CacheScope[]): Promise<void> {
  const unique = [...new Set(scopes)];
  try {
    await Promise.all(
      unique.map(async (scope) => {
        const next = (await redisGetVersion(scope)) + 1;
        await redisSetVersion(scope, next);
      }),
    );
  } catch (err) {
    // Log but don't rethrow - cache invalidation should not crash the API
    console.error("[cache] error invalidating scopes:", err instanceof Error ? err.message : err);
  }
}

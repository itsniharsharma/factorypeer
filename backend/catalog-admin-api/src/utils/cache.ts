type CacheScope =
  | "category"
  | "homepage"
  | "navigation"
  | "product"
  | "search"
  | "supplier"
  | "taxonomy";

function redisBaseUrl(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_URL"]?.trim().replace(/\/$/, "") || undefined;
}

function redisToken(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_TOKEN"]?.trim() || undefined;
}

function isRedisConfigured(): boolean {
  return Boolean(redisBaseUrl() && redisToken());
}

async function redisFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = redisBaseUrl();
  const token = redisToken();
  if (!base || !token) {
    return new Response(null, { status: 503 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${base}/${path.replace(/^\//, "")}`, {
      ...init,
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    // Fail gracefully - don't crash the API
    console.error("[cache] redis fetch error:", err instanceof Error ? err.message : err);
    return new Response(null, { status: 503 });
  }
}

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

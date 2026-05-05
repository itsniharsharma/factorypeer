import { createHash } from "node:crypto";

type CacheNamespace =
  | "category"
  | "homepage"
  | "navigation"
  | "product"
  | "search"
  | "supplier"
  | "taxonomy";

type CacheEnvelope<T> = {
  version: number;
  storedAt: number;
  freshForMs: number;
  staleForMs: number;
  value: T;
};

type CacheReadOptions = {
  namespace: CacheNamespace;
  key: string;
  loader: () => Promise<unknown>;
  ttlSeconds: number;
  staleWhileRevalidateSeconds?: number;
  label?: string;
};

const pendingLoads = new Map<string, Promise<unknown>>();
const inMemoryCache = new Map<string, CacheEnvelope<unknown>>();
const scopeVersions = new Map<CacheNamespace, { version: number; loadedAt: number }>();

function redisBaseUrl(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_URL"]?.trim().replace(/\/$/, "") || undefined;
}

function redisToken(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_TOKEN"]?.trim() || undefined;
}

function isRedisConfigured(): boolean {
  return Boolean(redisBaseUrl() && redisToken());
}

function shouldLogCache(): boolean {
  return process.env["NODE_ENV"] !== "production" || process.env["FP_CACHE_LOG"] === "1";
}

function logCache(event: string, details: Record<string, unknown>) {
  if (!shouldLogCache()) return;
  console.info(`[cache] ${event}`, details);
}

function cacheKey(namespace: CacheNamespace, key: string): string {
  return `fp:${namespace}:${key}`;
}

function scopeVersionKey(namespace: CacheNamespace): string {
  return `fp:version:${namespace}`;
}

function hashQuery(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 32);
}

async function redisFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = redisBaseUrl();
  const token = redisToken();
  if (!base || !token) {
    return new Response(null, { status: 503, statusText: "Redis not configured" });
  }

  const controller = new AbortController();
  const timeoutMs = 5000; // 5 second timeout for Redis operations
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

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
    const message = err instanceof Error ? err.message : String(err);
    // Log Redis errors but don't throw (graceful degradation)
    logCache("redis-fetch-error", {
      path,
      error: message,
      errorType: err instanceof Error ? err.constructor.name : typeof err,
    });
    // Return 503 to signal cache miss without crashing
    return new Response(null, { status: 503, statusText: "Redis unavailable" });
  }
}

async function redisGetJson<T>(key: string): Promise<T | undefined> {
  if (!isRedisConfigured()) return undefined;
  try {
    const res = await redisFetch(`get/${encodeURIComponent(key)}`);
    if (!res.ok) {
      if (res.status === 503) {
        logCache("redis-unavailable", { operation: "get", key });
      }
      return undefined;
    }
    const payload = (await res.json()) as { result?: T };
    return payload.result;
  } catch (err) {
    logCache("redis-get-parse-error", { key, error: String(err) });
    return undefined;
  }
}

async function redisSetJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!isRedisConfigured()) return;
  try {
    const body = encodeURIComponent(JSON.stringify(value));
    const res = await redisFetch(`set/${encodeURIComponent(key)}/${body}?ex=${ttlSeconds}`, {
      method: "POST",
    });
    if (!res.ok) {
      if (res.status === 503) {
        logCache("redis-unavailable", { operation: "set", key });
      } else {
        logCache("redis-set-failed", { key, status: res.status });
      }
    }
  } catch (err) {
    logCache("redis-set-error", { key, error: String(err) });
  }
}

async function redisDelete(key: string): Promise<void> {
  if (!isRedisConfigured()) return;
  try {
    const res = await redisFetch(`del/${encodeURIComponent(key)}`, { method: "POST" });
    if (!res.ok) {
      if (res.status === 503) {
        logCache("redis-unavailable", { operation: "delete", key });
      } else {
        logCache("redis-delete-failed", { key, status: res.status });
      }
    }
  } catch (err) {
    logCache("redis-delete-error", { key, error: String(err) });
  }
}

async function getScopeVersion(namespace: CacheNamespace): Promise<number> {
  const cached = scopeVersions.get(namespace);
  const now = Date.now();
  // Use cached version if recent (5 second TTL)
  if (cached && now - cached.loadedAt < 5_000) {
    return cached.version;
  }

  try {
    const raw = await redisGetJson<number>(scopeVersionKey(namespace));
    const version = typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
    scopeVersions.set(namespace, { version, loadedAt: now });
    return version;
  } catch (err) {
    logCache("scope-version-load-error", { namespace, error: String(err) });
    // Fall back to cached version or 0 on error
    return cached?.version ?? 0;
  }
}

async function setScopeVersion(namespace: CacheNamespace, version: number): Promise<void> {
  scopeVersions.set(namespace, { version, loadedAt: Date.now() });
  try {
    await redisSetJson(scopeVersionKey(namespace), version, 60 * 60 * 24 * 30);
  } catch (err) {
    logCache("scope-version-set-error", { namespace, version, error: String(err) });
  }
}

async function bumpScopeVersion(namespace: CacheNamespace): Promise<void> {
  try {
    const next = (await getScopeVersion(namespace)) + 1;
    await setScopeVersion(namespace, next);
  } catch (err) {
    logCache("scope-version-bump-error", { namespace, error: String(err) });
  }
}

function freshWindowMs(ttlSeconds: number): number {
  return Math.max(ttlSeconds * 1000, 1_000);
}

function staleWindowMs(ttlSeconds: number, staleWhileRevalidateSeconds?: number): number {
  const value = staleWhileRevalidateSeconds ?? Math.max(30, Math.floor(ttlSeconds / 3));
  return Math.max(value * 1000, 0);
}

function envelopeIsFresh<T>(entry: CacheEnvelope<T>, now: number): boolean {
  return now - entry.storedAt < entry.freshForMs;
}

function envelopeIsStaleButUsable<T>(entry: CacheEnvelope<T>, now: number): boolean {
  return now - entry.storedAt < entry.freshForMs + entry.staleForMs;
}

async function loadAndStore<T>(options: CacheReadOptions, version: number, cacheId: string): Promise<T> {
  const startedAt = Date.now();
  try {
    const value = (await options.loader()) as T;
    const entry: CacheEnvelope<T> = {
      version,
      storedAt: Date.now(),
      freshForMs: freshWindowMs(options.ttlSeconds),
      staleForMs: staleWindowMs(options.ttlSeconds, options.staleWhileRevalidateSeconds),
      value,
    };
    inMemoryCache.set(cacheId, entry);
    // Store to Redis but don't wait for it (fire and forget for non-critical failures)
    void redisSetJson(cacheId, entry, Math.ceil((entry.freshForMs + entry.staleForMs) / 1000));
    
    logCache("miss", {
      namespace: options.namespace,
      key: options.key,
      label: options.label,
      ms: Date.now() - startedAt,
    });
    return value;
  } catch (err) {
    // Loader failed - don't cache, let error propagate
    logCache("loader-error", {
      namespace: options.namespace,
      key: options.key,
      label: options.label,
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - startedAt,
    });
    throw err;
  }
}

async function revalidateInBackground<T>(options: CacheReadOptions, version: number, cacheId: string) {
  if (pendingLoads.has(cacheId)) return;
  
  const load = loadAndStore<T>(options, version, cacheId)
    .catch((err) => {
      logCache("background-revalidation-error", {
        namespace: options.namespace,
        key: options.key,
        label: options.label,
        error: err instanceof Error ? err.message : String(err),
      });
      // Don't rethrow - background revalidation failures should not crash the cache layer
    })
    .finally(() => {
      pendingLoads.delete(cacheId);
    });
  
  pendingLoads.set(cacheId, load);
  // Fire and forget (void operator suppresses the promise)
  void load;
}

export async function cacheAside<T>(options: CacheReadOptions): Promise<T> {
  const cacheId = cacheKey(options.namespace, options.key);
  const now = Date.now();
  const version = await getScopeVersion(options.namespace);

  const local = inMemoryCache.get(cacheId) as CacheEnvelope<T> | undefined;
  if (local && local.version === version) {
    if (envelopeIsFresh(local, now)) {
      logCache("hit", { namespace: options.namespace, key: options.key, label: options.label, source: "memory" });
      return local.value;
    }
    if (envelopeIsStaleButUsable(local, now)) {
      logCache("stale", { namespace: options.namespace, key: options.key, label: options.label, source: "memory" });
      void revalidateInBackground<T>(options, version, cacheId);
      return local.value;
    }
  }

  const redisEntry = await redisGetJson<CacheEnvelope<T>>(cacheId);
  if (redisEntry && redisEntry.version === version) {
    inMemoryCache.set(cacheId, redisEntry);
    if (envelopeIsFresh(redisEntry, now)) {
      logCache("hit", { namespace: options.namespace, key: options.key, label: options.label, source: "redis" });
      return redisEntry.value;
    }
    if (envelopeIsStaleButUsable(redisEntry, now)) {
      logCache("stale", { namespace: options.namespace, key: options.key, label: options.label, source: "redis" });
      void revalidateInBackground<T>(options, version, cacheId);
      return redisEntry.value;
    }
  }

  const existing = pendingLoads.get(cacheId) as Promise<T> | undefined;
  if (existing) return existing;

  const load = loadAndStore<T>(options, version, cacheId).finally(() => {
    pendingLoads.delete(cacheId);
  });
  pendingLoads.set(cacheId, load);
  return load;
}

export async function invalidateCacheScopes(scopes: CacheNamespace[]): Promise<void> {
  const unique = [...new Set(scopes)];
  try {
    await Promise.all(unique.map((scope) => bumpScopeVersion(scope)));
  } catch (err) {
    logCache("invalidate-scopes-error", {
      scopes: unique,
      error: err instanceof Error ? err.message : String(err),
    });
    // Don't rethrow - invalidation failures should not crash the application
  }
}

export async function invalidateCacheEntries(entries: Array<{ namespace: CacheNamespace; key: string }>): Promise<void> {
  await Promise.all(entries.map((entry) => redisDelete(cacheKey(entry.namespace, entry.key))));
}

export function getCachedQueryHash(value: string): string {
  return hashQuery(value.trim().toLowerCase());
}

export const cacheKeys = {
  category: (slug: string) => cacheKey("category", slug),
  homepage: (key: string) => cacheKey("homepage", key),
  navigation: (key: string) => cacheKey("navigation", key),
  product: (id: string) => cacheKey("product", id),
  search: (queryHash: string) => cacheKey("search", queryHash),
  supplier: (key: string) => cacheKey("supplier", key),
  taxonomyTree: () => cacheKey("taxonomy", "tree"),
};
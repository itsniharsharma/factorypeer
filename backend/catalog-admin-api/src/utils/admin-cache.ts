type CacheScope =
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

type CacheReadOptions<T> = {
  scope: CacheScope;
  key: string;
  ttlSeconds: number;
  staleWhileRevalidateSeconds?: number;
  loader: () => Promise<T>;
};

const pendingLoads = new Map<string, Promise<unknown>>();
const memoryCache = new Map<string, CacheEnvelope<unknown>>();
const scopeVersionMemo = new Map<CacheScope, { version: number; loadedAt: number }>();

function redisBaseUrl(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_URL"]?.trim().replace(/\/$/, "") || undefined;
}

function redisToken(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_TOKEN"]?.trim() || undefined;
}

function isRedisConfigured(): boolean {
  return Boolean(redisBaseUrl() && redisToken());
}

function cacheKey(scope: CacheScope, key: string): string {
  return `fp:admin:${scope}:${key}`;
}

function scopeVersionKey(scope: CacheScope): string {
  return `fp:version:${scope}`;
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
  } catch {
    clearTimeout(timeoutId);
    return new Response(null, { status: 503 });
  }
}

async function redisGetJson<T>(key: string): Promise<T | undefined> {
  if (!isRedisConfigured()) return undefined;
  const res = await redisFetch(`get/${encodeURIComponent(key)}`);
  if (!res.ok) return undefined;
  try {
    const payload = (await res.json()) as { result?: T };
    return payload.result;
  } catch {
    return undefined;
  }
}

async function redisSetJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!isRedisConfigured()) return;
  const body = encodeURIComponent(JSON.stringify(value));
  await redisFetch(`set/${encodeURIComponent(key)}/${body}?ex=${ttlSeconds}`, { method: "POST" });
}

async function getScopeVersion(scope: CacheScope): Promise<number> {
  const now = Date.now();
  const memo = scopeVersionMemo.get(scope);
  if (memo && now - memo.loadedAt < 5000) return memo.version;
  const raw = await redisGetJson<number>(scopeVersionKey(scope));
  const version = typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
  scopeVersionMemo.set(scope, { version, loadedAt: now });
  return version;
}

async function loadAndStore<T>(opts: CacheReadOptions<T>, version: number, k: string): Promise<T> {
  const value = await opts.loader();
  const freshForMs = Math.max(opts.ttlSeconds * 1000, 1000);
  const staleForMs = Math.max((opts.staleWhileRevalidateSeconds ?? 30) * 1000, 0);
  const entry: CacheEnvelope<T> = {
    version,
    storedAt: Date.now(),
    freshForMs,
    staleForMs,
    value,
  };
  memoryCache.set(k, entry);
  void redisSetJson(k, entry, Math.ceil((freshForMs + staleForMs) / 1000));
  return value;
}

function isFresh<T>(entry: CacheEnvelope<T>, now: number): boolean {
  return now - entry.storedAt < entry.freshForMs;
}

function isStaleUsable<T>(entry: CacheEnvelope<T>, now: number): boolean {
  return now - entry.storedAt < entry.freshForMs + entry.staleForMs;
}

function revalidateInBackground<T>(opts: CacheReadOptions<T>, version: number, k: string) {
  if (pendingLoads.has(k)) return;
  const load = loadAndStore(opts, version, k).finally(() => pendingLoads.delete(k));
  pendingLoads.set(k, load);
  void load;
}

export async function adminCacheAside<T>(opts: CacheReadOptions<T>): Promise<T> {
  const key = cacheKey(opts.scope, opts.key);
  const version = await getScopeVersion(opts.scope);
  const now = Date.now();

  const local = memoryCache.get(key) as CacheEnvelope<T> | undefined;
  if (local && local.version === version) {
    if (isFresh(local, now)) return local.value;
    if (isStaleUsable(local, now)) {
      revalidateInBackground(opts, version, key);
      return local.value;
    }
  }

  const redisEntry = await redisGetJson<CacheEnvelope<T>>(key);
  if (redisEntry && redisEntry.version === version) {
    memoryCache.set(key, redisEntry);
    if (isFresh(redisEntry, now)) return redisEntry.value;
    if (isStaleUsable(redisEntry, now)) {
      revalidateInBackground(opts, version, key);
      return redisEntry.value;
    }
  }

  const pending = pendingLoads.get(key) as Promise<T> | undefined;
  if (pending) return pending;
  const load = loadAndStore(opts, version, key).finally(() => pendingLoads.delete(key));
  pendingLoads.set(key, load);
  return load;
}

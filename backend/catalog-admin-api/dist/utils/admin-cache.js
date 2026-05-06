const pendingLoads = new Map();
const memoryCache = new Map();
const scopeVersionMemo = new Map();
function redisBaseUrl() {
    return process.env["UPSTASH_REDIS_REST_URL"]?.trim().replace(/\/$/, "") || undefined;
}
function redisToken() {
    return process.env["UPSTASH_REDIS_REST_TOKEN"]?.trim() || undefined;
}
function isRedisConfigured() {
    return Boolean(redisBaseUrl() && redisToken());
}
function cacheKey(scope, key) {
    return `fp:admin:${scope}:${key}`;
}
function scopeVersionKey(scope) {
    return `fp:version:${scope}`;
}
async function redisFetch(path, init) {
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
    }
    catch {
        clearTimeout(timeoutId);
        return new Response(null, { status: 503 });
    }
}
async function redisGetJson(key) {
    if (!isRedisConfigured())
        return undefined;
    const res = await redisFetch(`get/${encodeURIComponent(key)}`);
    if (!res.ok)
        return undefined;
    try {
        const payload = (await res.json());
        return payload.result;
    }
    catch {
        return undefined;
    }
}
async function redisSetJson(key, value, ttlSeconds) {
    if (!isRedisConfigured())
        return;
    const body = encodeURIComponent(JSON.stringify(value));
    await redisFetch(`set/${encodeURIComponent(key)}/${body}?ex=${ttlSeconds}`, { method: "POST" });
}
async function getScopeVersion(scope) {
    const now = Date.now();
    const memo = scopeVersionMemo.get(scope);
    if (memo && now - memo.loadedAt < 5000)
        return memo.version;
    const raw = await redisGetJson(scopeVersionKey(scope));
    const version = typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
    scopeVersionMemo.set(scope, { version, loadedAt: now });
    return version;
}
async function loadAndStore(opts, version, k) {
    const value = await opts.loader();
    const freshForMs = Math.max(opts.ttlSeconds * 1000, 1000);
    const staleForMs = Math.max((opts.staleWhileRevalidateSeconds ?? 30) * 1000, 0);
    const entry = {
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
function isFresh(entry, now) {
    return now - entry.storedAt < entry.freshForMs;
}
function isStaleUsable(entry, now) {
    return now - entry.storedAt < entry.freshForMs + entry.staleForMs;
}
function revalidateInBackground(opts, version, k) {
    if (pendingLoads.has(k))
        return;
    const load = loadAndStore(opts, version, k).finally(() => pendingLoads.delete(k));
    pendingLoads.set(k, load);
    void load;
}
export async function adminCacheAside(opts) {
    const key = cacheKey(opts.scope, opts.key);
    const version = await getScopeVersion(opts.scope);
    const now = Date.now();
    const local = memoryCache.get(key);
    if (local && local.version === version) {
        if (isFresh(local, now))
            return local.value;
        if (isStaleUsable(local, now)) {
            revalidateInBackground(opts, version, key);
            return local.value;
        }
    }
    const redisEntry = await redisGetJson(key);
    if (redisEntry && redisEntry.version === version) {
        memoryCache.set(key, redisEntry);
        if (isFresh(redisEntry, now))
            return redisEntry.value;
        if (isStaleUsable(redisEntry, now)) {
            revalidateInBackground(opts, version, key);
            return redisEntry.value;
        }
    }
    const pending = pendingLoads.get(key);
    if (pending)
        return pending;
    const load = loadAndStore(opts, version, key).finally(() => pendingLoads.delete(key));
    pendingLoads.set(key, load);
    return load;
}

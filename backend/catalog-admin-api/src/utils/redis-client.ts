export function redisBaseUrl(): string | undefined {
  return process.env["UPSTASH_REDIS_REST_URL"]?.trim().replace(/\/$/, "") || undefined;
}

export function redisToken(): string | undefined {
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"]?.trim() || undefined;
  if (!token) return undefined;
  if (token.includes("REPLACE_WITH_YOUR_REAL_TOKEN")) return undefined;
  return token;
}

export function isRedisConfigured(): boolean {
  return Boolean(redisBaseUrl() && redisToken());
}

export async function redisFetch(path: string, init?: RequestInit): Promise<Response> {
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
    console.error("[redis] fetch error:", err instanceof Error ? err.message : err);
    return new Response(null, { status: 503 });
  }
}

export async function redisGetJson<T>(key: string): Promise<T | undefined> {
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

export async function redisSetJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!isRedisConfigured()) return;
  const body = encodeURIComponent(JSON.stringify(value));
  await redisFetch(`set/${encodeURIComponent(key)}/${body}?ex=${ttlSeconds}`, { method: "POST" });
}

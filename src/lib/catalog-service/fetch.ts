/** Server-only catalog API fetch (direct to catalog-admin-api; same DB as admin UI proxy). */

function catalogUpstreamBase(): string {
  return (process.env["CATALOG_ADMIN_API_URL"] ?? "http://127.0.0.1:4040").replace(/\/$/, "");
}

export const DEFAULT_REVALIDATE_SECONDS = 60;

export class CatalogFetchError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "CatalogFetchError";
    this.status = status;
  }
}

async function catalogFetchOrThrow(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    throw new CatalogFetchError(
      503,
      `Cannot reach catalog API at ${catalogUpstreamBase()}: ${m}`,
    );
  }
}

export async function catalogServerJson<T>(
  path: string,
  init?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  },
): Promise<T> {
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${catalogUpstreamBase()}/admin/catalog${p}`;
  const res = await catalogFetchOrThrow(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {}),
    },
    next: init?.next ?? { revalidate: DEFAULT_REVALIDATE_SECONDS, tags: ["catalog"] },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) detail = body.message;
    } catch {
      /* ignore */
    }
    throw new CatalogFetchError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;

  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return undefined as T;

  return res.json() as Promise<T>;
}

export async function catalogServerJsonList<T>(
  path: string,
  init?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  },
): Promise<{ data: T; total?: number }> {
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${catalogUpstreamBase()}/admin/catalog${p}`;
  const res = await catalogFetchOrThrow(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {}),
    },
    next: init?.next ?? { revalidate: DEFAULT_REVALIDATE_SECONDS, tags: ["catalog"] },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) detail = body.message;
    } catch {
      /* ignore */
    }
    throw new CatalogFetchError(res.status, detail);
  }

  const total = (() => {
    const raw = res.headers.get("x-total-count");
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  })();

  return { data: (await res.json()) as T, total };
}

import { ADMIN_CATALOG_API_BASE } from "./config";

export type ApiErrorBody = {
  error?: string;
  message?: string;
  /** Next.js proxy and some routes attach extra context. */
  detail?: string;
};

export class AdminApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

function actorHeaders(): HeadersInit {
  const id = typeof window !== "undefined" ? localStorage.getItem("catalogActorId") : null;
  const fromEnv = process.env["NEXT_PUBLIC_CATALOG_ACTOR_ID"];
  const actor = id ?? fromEnv;
  return actor && /^[a-f\d]{24}$/i.test(actor)
    ? { "x-catalog-actor-id": actor }
    : {};
}

export async function adminFetch(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<Response> {
  const { json, headers: hdr, ...rest } = init ?? {};
  const headers = new Headers(hdr);
  if (json !== undefined) {
    headers.set("content-type", "application/json");
  }
  Object.entries(actorHeaders()).forEach(([k, v]) => headers.set(k, v));

  const res = await fetch(`${ADMIN_CATALOG_API_BASE}${path}`, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });
  return res;
}

export async function adminFetchJson<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const res = await adminFetch(path, init);
  if (!res.ok) {
    let msg = res.statusText;
    let code: string | undefined;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.message) msg = body.message;
      if (body.error) code = body.error;
      if (body.detail) msg = `${msg} — ${body.detail}`;
    } catch {
      /* ignore */
    }
    throw new AdminApiError(res.status, msg, code);
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export function getTotalCount(res: Response): number | undefined {
  const raw = res.headers.get("x-total-count");
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/** Fetch JSON and total count (list endpoints). */
export async function adminFetchJsonList<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<{ data: T; total?: number }> {
  const res = await adminFetch(path, init);
  if (!res.ok) {
    let msg = res.statusText;
    let code: string | undefined;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.message) msg = body.message;
      if (body.error) code = body.error;
      if (body.detail) msg = `${msg} — ${body.detail}`;
    } catch {
      /* ignore */
    }
    throw new AdminApiError(res.status, msg, code);
  }
  const total = getTotalCount(res);
  const data = (await res.json()) as T;
  return { data, total };
}

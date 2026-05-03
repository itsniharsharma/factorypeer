import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCatalogAdminApiBaseUrl } from "@/config/catalog-env";

export const dynamic = "force-dynamic";

/** Abort hung upstream calls so the admin UI fails fast instead of hanging → opaque 500s. */
const UPSTREAM_TIMEOUT_MS = 25_000;

function upstreamBase(): string {
  return getCatalogAdminApiBaseUrl();
}

function jsonError(
  status: number,
  code: string,
  message: string,
  detail?: string,
): NextResponse {
  return NextResponse.json(
    { error: code, message, ...(detail ? { detail } : {}) },
    { status, headers: { "content-type": "application/json" } },
  );
}

async function proxy(
  req: NextRequest,
  method: string,
  segmentData: { params: Promise<{ path?: string[] }> },
): Promise<NextResponse> {
  const { path = [] } = await segmentData.params;
  const pathStr = path.length ? path.join("/") : "";
  const suffix = pathStr ? `/${pathStr}` : "";
  const url = `${upstreamBase()}/admin/catalog${suffix}${req.nextUrl.search}`;

  const headers = new Headers();
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const actor = req.headers.get("x-catalog-actor-id");
  if (actor) headers.set("x-catalog-actor-id", actor);
  const auth = req.headers.get("authorization");
  if (auth) headers.set("authorization", auth);

  let body: ArrayBuffer | undefined;
  try {
    body =
      method !== "GET" && method !== "HEAD" ? await req.arrayBuffer() : undefined;
  } catch (e) {
    return jsonError(
      400,
      "REQUEST_BODY_READ_FAILED",
      "Could not read request body.",
      e instanceof Error ? e.message : undefined,
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      cache: "no-store",
      signal: controller.signal,
    });

    const outHeaders = new Headers();
    const outCt = res.headers.get("content-type");
    if (outCt) outHeaders.set("content-type", outCt);
    const total = res.headers.get("x-total-count");
    if (total) outHeaders.set("x-total-count", total);

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: res.status,
      headers: outHeaders,
    });
  } catch (e) {
    const isAbort = e instanceof Error && e.name === "AbortError";
    const msg =
      e instanceof Error ? e.message : "Unknown error";
    const hint =
      process.env["NODE_ENV"] === "development"
        ? `Target: ${upstreamBase()}. Start catalog-admin-api (default port 4040) or set CATALOG_ADMIN_API_URL.`
        : "Catalog service is unavailable.";
    if (process.env["NODE_ENV"] === "development") {
      console.error(`[catalog proxy] ${method} ${url}`, isAbort ? "(timeout)" : "", e);
    }
    return jsonError(
      503,
      isAbort ? "CATALOG_UPSTREAM_TIMEOUT" : "CATALOG_UPSTREAM_UNREACHABLE",
      isAbort
        ? `Catalog API did not respond within ${UPSTREAM_TIMEOUT_MS / 1000}s.`
        : "Could not reach catalog-admin-api.",
      `${msg}. ${hint}`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  return proxy(req, "GET", ctx);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  return proxy(req, "POST", ctx);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  return proxy(req, "PATCH", ctx);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  return proxy(req, "DELETE", ctx);
}

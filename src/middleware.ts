import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "fp_admin_token";

function timingSafeStringEqual(expected: string, actual: string): boolean {
  if (expected.length !== actual.length) return false;

  let out = 0;
  for (let i = 0; i < expected.length; i++) {
    out |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  }

  return out === 0;
}

function forwardHeaders(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = request.nextUrl;
  const shell =
    pathname.startsWith("/admin/login") || pathname === "/admin/login" ? "login" : "app";
  requestHeaders.set("x-factorypeer-admin-route", shell);
  return requestHeaders;
}

/**
 * When `NEXT_ADMIN_TOKEN` is set, `/admin/*` (except `/admin/login`) requires an HttpOnly session cookie
 * set via `POST /api/admin/session`. Omit in local dev for frictionless iteration.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = forwardHeaders(request);
  const { pathname } = request.nextUrl;

  const secret = process.env.NEXT_ADMIN_TOKEN?.trim();
  if (!secret) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/admin/login") || pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  if (cookie && timingSafeStringEqual(secret, cookie)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("from", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

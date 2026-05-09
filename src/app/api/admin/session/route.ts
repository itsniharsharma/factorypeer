import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/middleware";
import { getAdminSessionToken } from "@/config/server-env";

export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(req: Request) {
  const configured = getAdminSessionToken();
  if (!configured) {
    return NextResponse.json(
      { error: "AUTH_NOT_CONFIGURED", message: "NEXT_ADMIN_TOKEN is not set on the server." },
      { status: 501 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON", message: "Expected JSON body." }, { status: 400 });
  }
  const token =
    typeof body === "object" && body !== null && "token" in body
      ? String((body as { token?: unknown }).token ?? "")
      : "";

  if (!safeEqual(configured, token)) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS", message: "Invalid token." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, configured, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}

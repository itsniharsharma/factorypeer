import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/middleware";
import { getAdminSessionToken } from "@/config/server-env";
import { incrementRedisKey, invalidateCacheScopes, redisSetJson } from "@/lib/cache/redis-cache";
import { generateCanonicalGraph } from "@/lib/taxonomy/graph-generator";
import graphStore from "@/lib/taxonomy/graph-store";

export const dynamic = "force-dynamic";

const GRAPH_DATA_KEY = "taxonomy:graph:data";
const GRAPH_VERSION_KEY = "taxonomy:graph:version";
const GRAPH_DATA_TTL_SECONDS = 60 * 60 * 24 * 30;

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ error: status === 401 ? "UNAUTHORIZED" : "AUTH_NOT_CONFIGURED", message }, { status });
}

export async function POST() {
  const configured = getAdminSessionToken();
  if (!configured) {
    return unauthorized("NEXT_ADMIN_TOKEN is not set on the server.", 501);
  }

  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value?.trim() ?? "";
  if (!token || !safeEqual(configured, token)) {
    return unauthorized("Valid admin session required.", 401);
  }

  const graph = await generateCanonicalGraph();
  const nextVersion = await incrementRedisKey(GRAPH_VERSION_KEY);
  if (typeof nextVersion !== "number") {
    return unauthorized("Unable to increment taxonomy graph version.", 503);
  }

  const publishedGraph = {
    ...graph,
    meta: {
      ...graph.meta,
      version: nextVersion,
    },
  };

  await redisSetJson(GRAPH_DATA_KEY, { version: nextVersion, graph: publishedGraph }, GRAPH_DATA_TTL_SECONDS);
  await invalidateCacheScopes(["taxonomy"]);
  await graphStore.primeCanonicalGraph(publishedGraph, nextVersion);

  return NextResponse.json({
    ok: true,
    generatedAt: publishedGraph.meta.generatedAt,
    nodeCount: publishedGraph.meta.nodeCount,
    maxDepth: publishedGraph.meta.maxDepth,
    version: nextVersion,
  });
}

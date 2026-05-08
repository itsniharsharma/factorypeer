import { cacheAside, redisGetJson, redisSetJson } from "@/lib/cache/redis-cache";
import generateCanonicalGraph, { CanonicalGraph } from "./graph-generator";

const GRAPH_DATA_KEY = "taxonomy:graph:data";
const GRAPH_VERSION_KEY = "taxonomy:graph:version";
const GRAPH_SOURCE_CACHE_KEY = "graph:source";
const GRAPH_DATA_TTL_SECONDS = 60 * 60 * 24 * 30;

type CanonicalGraphEnvelope = {
  version: number;
  graph: CanonicalGraph;
};

let currentGraph: CanonicalGraph | undefined;
let currentGraphVersion = -1;
let currentReload: Promise<CanonicalGraph> | undefined;

function shouldLogGraphEvents(): boolean {
  return process.env["NODE_ENV"] !== "production" || process.env["FP_TAXONOMY_DEBUG"] === "1";
}

function logGraphEvent(event: string, details: Record<string, unknown>) {
  if (!shouldLogGraphEvents()) return;
  console.info(`[taxonomy-graph] ${event}`, details);
}

function normalizeGraphVersion(graph: CanonicalGraph, version: number): CanonicalGraph {
  return graph.meta.version === version ? graph : { ...graph, meta: { ...graph.meta, version } };
}

async function readGraphVersion(): Promise<number> {
  const raw = await redisGetJson<number>(GRAPH_VERSION_KEY);
  return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
}

async function loadGraphFromSource(version: number): Promise<CanonicalGraph> {
  const graph = await cacheAside<CanonicalGraph>({
    namespace: "taxonomy",
    key: GRAPH_SOURCE_CACHE_KEY,
    ttlSeconds: 60 * 60,
    staleWhileRevalidateSeconds: 15 * 60,
    label: "canonical-graph-source",
    loader: async () => generateCanonicalGraph(),
  });

  const normalized = normalizeGraphVersion(graph, version);
  void redisSetJson<CanonicalGraphEnvelope>(GRAPH_DATA_KEY, { version, graph: normalized }, GRAPH_DATA_TTL_SECONDS);
  return normalized;
}

async function loadGraphForVersion(version: number): Promise<CanonicalGraph> {
  const envelope = await redisGetJson<CanonicalGraphEnvelope>(GRAPH_DATA_KEY);
  if (envelope && envelope.version === version && envelope.graph) {
    return normalizeGraphVersion(envelope.graph, version);
  }

  if (envelope) {
    logGraphEvent("version-mismatch", {
      expectedVersion: version,
      storedVersion: envelope.version,
    });
  }

  return loadGraphFromSource(version);
}

export async function primeCanonicalGraph(graph: CanonicalGraph, version: number): Promise<void> {
  currentGraph = normalizeGraphVersion(graph, version);
  currentGraphVersion = version;
}

export async function getCanonicalGraph(): Promise<CanonicalGraph> {
  const redisVersion = await readGraphVersion();
  if (currentGraph && currentGraphVersion === redisVersion) {
    return currentGraph;
  }

  if (currentGraph) {
    logGraphEvent("version-mismatch", {
      currentGraphVersion,
      redisVersion,
    });
  }

  if (currentReload) return currentReload;

  currentReload = (async () => {
    const startedAt = Date.now();
    let targetVersion = redisVersion;

    for (let attempt = 0; attempt < 3; attempt++) {
      const loaded = await loadGraphForVersion(targetVersion);
      const latestVersion = await readGraphVersion();

      if (latestVersion === targetVersion) {
        await primeCanonicalGraph(loaded, targetVersion);
        logGraphEvent("reload", {
          version: targetVersion,
          ms: Date.now() - startedAt,
          attempt,
        });
        return loaded;
      }

      logGraphEvent("version-mismatch-during-reload", {
        targetVersion,
        latestVersion,
        attempt,
      });
      targetVersion = latestVersion;
    }

    const latestVersion = await readGraphVersion();
    const loaded = await loadGraphForVersion(latestVersion);
    await primeCanonicalGraph(loaded, latestVersion);
    logGraphEvent("reload", {
      version: latestVersion,
      ms: Date.now() - startedAt,
      attempt: 3,
    });
    return loaded;
  })().finally(() => {
    currentReload = undefined;
  });

  return currentReload;
}

export async function clearInMemoryGraph() {
  currentGraph = undefined;
  currentGraphVersion = -1;
}

export async function getNodeById(id: string) {
  const g = await getCanonicalGraph();
  return g.byId[id];
}

export async function getNodeIdBySlugPath(slugPath: string[]) {
  const g = await getCanonicalGraph();
  const key = slugPath.join('/');
  return g.bySlugPath[key];
}

export async function getNodeBySlugPath(slugPath: string[]) {
  const id = await getNodeIdBySlugPath(slugPath);
  if (!id) return undefined;
  return getNodeById(id);
}

export async function getChildren(parentId: string | null) {
  const g = await getCanonicalGraph();
  const key = parentId ?? 'root';
  const ids = g.childrenByParent[key] ?? [];
  return ids.map((id) => g.byId[id]).filter(Boolean);
}

export async function getBreadcrumbsForNode(id: string) {
  const g = await getCanonicalGraph();
  const node = g.byId[id];
  if (!node) return [];
  const crumbs = [{ label: 'All Products', href: '/' }];
  const segments: string[] = [];
  for (const ancId of [...node.ancestorIds, node.id]) {
    const n = g.byId[ancId];
    if (!n) continue;
    segments.push(n.slug);
    crumbs.push({ label: n.title, href: `/category/${segments.join('/')}` });
  }
  return crumbs;
}

const graphStore = {
  getCanonicalGraph,
  getNodeById,
  getNodeBySlugPath,
  getChildren,
  getBreadcrumbsForNode,
  clearInMemoryGraph,
  primeCanonicalGraph,
};

export default graphStore;

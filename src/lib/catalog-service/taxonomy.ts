import { cache } from "react";
import type {
  CatalogBreadcrumb,
  CatalogTaxonomyNode,
  MegaMenuRootGroup,
} from "@/lib/types";
import { buildSpecMatrixPage, DEFAULT_MATRIX_PAGE_SIZE } from "./matrix";
import { cacheAside } from "@/lib/cache/redis-cache";
import graphStore from "@/lib/taxonomy/graph-store";

export type CatalogRouteContext = {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
};

/** Deterministic sibling order from admin `sortOrder`. */
export function sortTaxonomySiblings(nodes: CatalogTaxonomyNode[]): CatalogTaxonomyNode[] {
  return [...nodes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function sortTreeRecursive(nodes: CatalogTaxonomyNode[]): CatalogTaxonomyNode[] {
  const sorted = sortTaxonomySiblings(nodes);
  return sorted.map((n) => ({ ...n, children: sortTreeRecursive(n.children) }));
}

export function pathHrefFromSegments(segments: string[]): string {
  return `/category/${segments.join("/")}`;
}

export function buildMegaMenuGroups(tree: CatalogTaxonomyNode[]): MegaMenuRootGroup[] {
  const roots = sortTaxonomySiblings(tree);
  return roots.map((root) => {
    const rootHref = pathHrefFromSegments([root.slug]);
    const children = sortTaxonomySiblings(root.children).map((child) => ({
      id: child.id,
      label: child.title,
      href: pathHrefFromSegments([root.slug, child.slug]),
    }));
    return {
      root: {
        id: root.id,
        label: root.title,
        href: rootHref,
      },
      children,
    };
  });
}

export const getTaxonomyTree = cache(async (): Promise<CatalogTaxonomyNode[]> => {
  // Backwards-compatible: reconstruct the recursive tree from the canonical graph
  return cacheAside({
    namespace: "taxonomy",
    key: "tree",
    ttlSeconds: 60 * 60,
    staleWhileRevalidateSeconds: 15 * 60,
    label: "taxonomy-tree",
    loader: async () => {
      const g = await graphStore.getCanonicalGraph();
      // Recreate nested CatalogTaxonomyNode structure from graph (small, fast in-memory transform)
      function nodeFromId(id: string): CatalogTaxonomyNode {
        const meta = g.byId[id];
        const children = (g.childrenByParent[id] ?? []).map((cid) => nodeFromId(cid));
        return {
          id: meta.id,
          slug: meta.slug,
          title: meta.title,
          description: meta.description ?? "",
          productCount: meta.productCount ?? 0,
          landingImage: meta.landingImage,
          children,
          filters: [],
          matrix: undefined,
          kind: meta.kind,
          activeSpecSchemaId: meta.activeSpecSchemaId ?? null,
          sortOrder: meta.sortOrder ?? 0,
        };
      }

      const roots = g.rootNodes.map((id) => nodeFromId(id));
      return sortTreeRecursive(roots);
    },
  });
});

export const getMegaMenuNavigation = cache(async () => {
  return cacheAside({
    namespace: "navigation",
    key: "mega-menu",
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: "mega-menu",
    loader: async () => {
      const tree = await getTaxonomyTree();
      return {
        groups: buildMegaMenuGroups(tree),
      };
    },
  });
});

/** DFS lookup by catalog category id — used to prefer `family` nodes for matrix/spec resolution. */
export function findTaxonomyNodeById(
  nodes: CatalogTaxonomyNode[],
  id: string,
): CatalogTaxonomyNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const d = findTaxonomyNodeById(n.children, id);
    if (d) return d;
  }
  return undefined;
}

/**
 * @param pathKey - Category path as `segment/segment/...` (primitives for React `cache` key stability).
 * @param matrixPage - 0-based matrix page for family nodes (`?m=` on category URL).
 */
export const getRouteContext = cache(
  async (pathKey: string, matrixPage: number = 0): Promise<CatalogRouteContext | undefined> => {
    const pathSegments = pathKey.length > 0 ? pathKey.split("/") : [];
    const page = Math.max(0, Math.floor(matrixPage));
    if (pathSegments.length === 0) return undefined;
    // Fast path: use canonical graph for O(1) lookups
    const nodeMeta = await graphStore.getNodeBySlugPath(pathSegments);
    if (!nodeMeta) return undefined;
    const breadcrumbs = await graphStore.getBreadcrumbsForNode(nodeMeta.id);
    // Build a minimal CatalogTaxonomyNode for the current node with immediate children
    const children = (await graphStore.getChildren(nodeMeta.id)).map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description ?? "",
      productCount: c.productCount ?? 0,
      landingImage: c.landingImage,
      children: [],
      filters: [],
      matrix: undefined,
      kind: c.kind,
      activeSpecSchemaId: c.activeSpecSchemaId ?? null,
      sortOrder: c.sortOrder ?? 0,
    }));

    const node: CatalogTaxonomyNode = {
      id: nodeMeta.id,
      slug: nodeMeta.slug,
      title: nodeMeta.title,
      description: nodeMeta.description ?? "",
      productCount: nodeMeta.productCount ?? 0,
      landingImage: nodeMeta.landingImage,
      children,
      filters: [],
      matrix: undefined,
      kind: nodeMeta.kind,
      activeSpecSchemaId: nodeMeta.activeSpecSchemaId ?? null,
      sortOrder: nodeMeta.sortOrder ?? 0,
    };

    let enriched: CatalogTaxonomyNode = node;
    if (node.kind === "family" && node.activeSpecSchemaId) {
      try {
        const matrix = await buildSpecMatrixPage(node.id, page, DEFAULT_MATRIX_PAGE_SIZE);
        if (matrix) {
          enriched = {
            ...node,
            matrix,
            productCount: matrix.totalRowCount,
          };
        }
      } catch {
        // Matrix/spec APIs are optional enrichment — failures must not turn a valid category URL into 404.
        enriched = node;
      }
    }

    return {
      node: enriched,
      breadcrumbs,
      pathSegments,
    };
  },
);

import { cache } from "react";
import type { CategoryDoc } from "@/lib/admin-api/types";
import type {
  CatalogBreadcrumb,
  CatalogTaxonomyNode,
  MegaMenuRootGroup,
} from "@/lib/types";
import { catalogServerJson } from "./fetch";
import { buildSpecMatrixPage, DEFAULT_MATRIX_PAGE_SIZE } from "./matrix";
import { cacheAside } from "@/lib/cache/redis-cache";

export type CatalogRouteContext = {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
};

function filterPublished(nodes: CategoryDoc[]): CategoryDoc[] {
  return nodes
    .filter((n) => n.status === "published")
    .map((n) => ({
      ...n,
      children: n.children?.length ? filterPublished(n.children) : [],
    }));
}

function categoryToTaxonomyNode(doc: CategoryDoc): CatalogTaxonomyNode {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    productCount: 0,
    landingImage: doc.landingImage?.url
      ? {
          url: doc.landingImage.url,
          alt: doc.landingImage.alt,
        }
      : undefined,
    children: (doc.children ?? []).map(categoryToTaxonomyNode),
    filters: [],
    matrix: undefined,
    kind: doc.kind,
    activeSpecSchemaId: doc.activeSpecSchemaId ?? null,
    sortOrder: doc.sortOrder ?? 0,
  };
}

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
  return cacheAside({
    namespace: "taxonomy",
    key: "tree",
    ttlSeconds: 60 * 60,
    staleWhileRevalidateSeconds: 15 * 60,
    label: "taxonomy-tree",
    loader: async () => {
      const raw = await catalogServerJson<CategoryDoc[]>("/categories/tree");
      return sortTreeRecursive(filterPublished(raw).map(categoryToTaxonomyNode));
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

function findNodeAtPath(
  segments: string[],
  nodes: CatalogTaxonomyNode[],
): CatalogTaxonomyNode | undefined {
  if (segments.length === 0) return undefined;
  const [head, ...rest] = segments;
  const n = nodes.find((c) => c.slug === head);
  if (!n) return undefined;
  if (rest.length === 0) return n;
  return findNodeAtPath(rest, n.children);
}

function buildBreadcrumbTrail(
  segments: string[],
  tree: CatalogTaxonomyNode[],
): CatalogBreadcrumb[] {
  const crumbs: CatalogBreadcrumb[] = [];
  const acc: string[] = [];
  for (const seg of segments) {
    acc.push(seg);
    const node = findNodeAtPath(acc, tree);
    if (node) {
      crumbs.push({
        label: node.title,
        href: `/category/${acc.join("/")}`,
      });
    }
  }
  return crumbs;
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
    const tree = await getTaxonomyTree();
    const node = findNodeAtPath(pathSegments, tree);
    if (!node) return undefined;
    const breadcrumbs = buildBreadcrumbTrail(pathSegments, tree);

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


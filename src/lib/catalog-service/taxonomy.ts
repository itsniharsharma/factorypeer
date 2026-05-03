import { cache } from "react";
import type { CategoryDoc } from "@/lib/admin-api/types";
import type { CatalogBreadcrumb, CatalogNavLinkItem, CatalogTaxonomyNode } from "@/lib/types";
import { catalogServerJson } from "./fetch";
import { buildSpecMatrixForCategory } from "./matrix";

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
    children: (doc.children ?? []).map(categoryToTaxonomyNode),
    filters: [],
    matrix: undefined,
    kind: doc.kind,
    activeSpecSchemaId: doc.activeSpecSchemaId ?? null,
  };
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

export const getTaxonomyTree = cache(async (): Promise<CatalogTaxonomyNode[]> => {
  const raw = await catalogServerJson<CategoryDoc[]>("/categories/tree");
  return filterPublished(raw).map(categoryToTaxonomyNode);
});

export const getRouteContext = cache(
  async (pathSegments: string[]): Promise<CatalogRouteContext | undefined> => {
    if (pathSegments.length === 0) return undefined;
    const tree = await getTaxonomyTree();
    const node = findNodeAtPath(pathSegments, tree);
    if (!node) return undefined;
    const breadcrumbs = buildBreadcrumbTrail(pathSegments, tree);

    let enriched: CatalogTaxonomyNode = node;
    if (node.kind === "family" && node.activeSpecSchemaId) {
      const matrix = await buildSpecMatrixForCategory(node.id);
      if (matrix) {
        enriched = {
          ...node,
          matrix,
          productCount: matrix.rows.length,
        };
      }
    }

    return {
      node: enriched,
      breadcrumbs,
      pathSegments,
    };
  },
);

function collectNavItems(
  nodes: CatalogTaxonomyNode[],
  depth: number,
  parentPath: string[],
  out: CatalogNavLinkItem[],
  previewOut: CatalogNavLinkItem[],
) {
  for (const node of nodes) {
    const pathSegments = [...parentPath, node.slug];
    const href = `/category/${pathSegments.join("/")}`;
    out.push({
      id: node.id,
      label: node.title,
      href,
      isHeader: depth === 0,
    });
    if (depth <= 1) {
      previewOut.push({
        id: `preview-${node.id}`,
        label: node.title,
        href,
      });
    }
    if (node.children.length) {
      collectNavItems(node.children, depth + 1, pathSegments, out, previewOut);
    }
  }
}

export function getMegaMenuLinkColumns(tree: CatalogTaxonomyNode[], columnCount = 4): CatalogNavLinkItem[][] {
  const navItems: CatalogNavLinkItem[] = [];
  const previewLinks: CatalogNavLinkItem[] = [];
  collectNavItems(tree, 0, [], navItems, previewLinks);
  if (navItems.length === 0) return [];
  const safeColumnCount = Math.max(1, columnCount);
  const size = Math.ceil(navItems.length / safeColumnCount);
  return Array.from({ length: safeColumnCount }, (_, index) =>
    navItems.slice(index * size, (index + 1) * size),
  ).filter((column) => column.length > 0);
}

export function getTopNavPreviewLinksFromTree(tree: CatalogTaxonomyNode[], limit = 6): CatalogNavLinkItem[] {
  const previewLinks: CatalogNavLinkItem[] = [];
  const navItems: CatalogNavLinkItem[] = [];
  collectNavItems(tree, 0, [], navItems, previewLinks);
  return previewLinks.slice(0, limit);
}

export const getMegaMenuNavigation = cache(async () => {
  const tree = await getTaxonomyTree();
  return {
    columns: getMegaMenuLinkColumns(tree, 4),
    previewLinks: getTopNavPreviewLinksFromTree(tree, 6),
  };
});

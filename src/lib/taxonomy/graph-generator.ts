import { catalogServerJsonList } from "@/lib/catalog-service/fetch";
import type { CategoryDoc } from "@/lib/admin-api/types";

export type RawCategoryDoc = CategoryDoc;

export type NodeMeta = {
  id: string;
  slug: string;
  title: string;
  description: string;
  parentId: string | null;
  depth: number;
  sortOrder?: number;
  kind?: "branch" | "family";
  activeSpecSchemaId?: string | null;
  productCount: number;
  directChildrenCount: number;
  landingImage?: { url: string; alt?: string };
  slugPath: string[];
  ancestorIds: string[];
};

export type CanonicalGraph = {
  meta: {
    version?: number;
    generatedAt: string;
    nodeCount: number;
    maxDepth: number;
  };
  byId: Record<string, NodeMeta>;
  bySlugPath: Record<string, string>; // slugPathKey -> id
  childrenByParent: Record<string, string[]>; // parentId|null -> [childIds]
  rootNodes: string[];
};

/**
 * Build a canonical graph from the category tree returned by the admin API.
 * This is intentionally straightforward and deterministic.
 */
export async function generateCanonicalGraph(): Promise<CanonicalGraph> {
  const res = await catalogServerJsonList<RawCategoryDoc[]>('/categories/tree');
  const data: RawCategoryDoc[] = Array.isArray(res.data) ? res.data : [];

  const byId: Record<string, NodeMeta> = {};
  const childrenByParent: Record<string, string[]> = {};
  const bySlugPath: Record<string, string> = {};
  let maxDepth = 0;

  function slugKey(path: string[]) {
    return path.join('/');
  }

  function walk(
    node: RawCategoryDoc,
    parentId: string | null,
    ancestorIds: string[],
    slugPath: string[],
    depth: number,
  ): number {
    const id = String(node._id);
    const thisSlugPath = [...slugPath, node.slug];
    const nodeWithCount = node as unknown as { productCount?: number };
    const nodeWithKind = node as unknown as { kind?: "branch" | "family"; activeSpecSchemaId?: string | null };
    let childAggregatedCount = 0;
    const childIds: string[] = [];

    if (node.children?.length) {
      for (const child of node.children) {
        childAggregatedCount += walk(child, id, [...ancestorIds, id], thisSlugPath, depth + 1);
        childIds.push(String(child._id));
      }
    }

    const meta: NodeMeta = {
      id,
      slug: node.slug,
      title: node.title,
      description: node.description ?? "",
      parentId,
      depth,
      sortOrder: node.sortOrder ?? 0,
      kind: nodeWithKind.kind,
      activeSpecSchemaId: nodeWithKind.activeSpecSchemaId ?? null,
      productCount:
        (typeof nodeWithCount.productCount === "number" ? nodeWithCount.productCount : 0) + childAggregatedCount,
      directChildrenCount: node.children?.length ?? 0,
      landingImage: node.landingImage?.url ? { url: node.landingImage.url, alt: node.landingImage.alt } : undefined,
      slugPath: thisSlugPath,
      ancestorIds: [...ancestorIds],
    };
    byId[id] = meta;
    bySlugPath[slugKey(thisSlugPath)] = id;
    maxDepth = Math.max(maxDepth, depth);
    childrenByParent[parentId ?? 'root'] = childrenByParent[parentId ?? 'root'] ?? [];
    if (!childrenByParent[parentId ?? 'root'].includes(id)) childrenByParent[parentId ?? 'root'].push(id);
    childrenByParent[id] = childIds;
    return meta.productCount;
  }

  for (const root of data) {
    walk(root, null, [], [], 0);
  }

  const rootNodes = childrenByParent['root'] ?? [];

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      nodeCount: Object.keys(byId).length,
      maxDepth,
    },
    byId,
    bySlugPath,
    childrenByParent,
    rootNodes,
  } as CanonicalGraph;
}

export default generateCanonicalGraph;

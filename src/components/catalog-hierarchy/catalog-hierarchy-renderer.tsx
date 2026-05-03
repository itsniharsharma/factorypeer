import { CatalogNodeLanding } from "@/components/catalog-hierarchy/catalog-node-landing";
import { SpecMatrixRenderer } from "@/components/catalog-hierarchy/spec-matrix-renderer";
import { CatalogBreadcrumb, CatalogTaxonomyNode } from "@/lib/types";

interface CatalogHierarchyRendererProps {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
}

export function CatalogHierarchyRenderer({
  node,
  breadcrumbs,
  pathSegments,
}: CatalogHierarchyRendererProps) {
  if (node.matrix) {
    return <SpecMatrixRenderer node={node} breadcrumbs={breadcrumbs} />;
  }

  return (
    <CatalogNodeLanding node={node} breadcrumbs={breadcrumbs} pathSegments={pathSegments} />
  );
}

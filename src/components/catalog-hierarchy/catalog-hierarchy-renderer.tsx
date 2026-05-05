import { CatalogNodeLanding } from "@/components/catalog-hierarchy/catalog-node-landing";
import { SpecMatrixRenderer } from "@/components/catalog-hierarchy/spec-matrix-renderer";
import { CatalogBreadcrumb, CatalogTaxonomyNode, Product } from "@/lib/types";

interface CatalogHierarchyRendererProps {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
  bannerImage?: string;
  bannerImageAlt?: string;
  featuredProducts?: Product[];
}

export function CatalogHierarchyRenderer({
  node,
  breadcrumbs,
  pathSegments,
  bannerImage,
  bannerImageAlt,
  featuredProducts = [],
}: CatalogHierarchyRendererProps) {
  if (node.matrix) {
    return (
      <SpecMatrixRenderer
        node={node}
        breadcrumbs={breadcrumbs}
        pathSegments={pathSegments}
      />
    );
  }

  return (
    <CatalogNodeLanding
      node={node}
      breadcrumbs={breadcrumbs}
      pathSegments={pathSegments}
      bannerImage={bannerImage}
      bannerImageAlt={bannerImageAlt}
      featuredProducts={featuredProducts}
    />
  );
}

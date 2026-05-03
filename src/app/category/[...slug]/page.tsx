import { notFound } from "next/navigation";
import { CatalogHierarchyRenderer } from "@/components/catalog-hierarchy/catalog-hierarchy-renderer";
import { AppShell } from "@/components/layout/app-shell";
import { getRouteContext, getTaxonomyTree } from "@/lib/catalog-service";
import type { CatalogTaxonomyNode } from "@/lib/types";

export const revalidate = 60;

interface CategoryHierarchyPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  try {
    const tree = await getTaxonomyTree();
    const paths: Array<{ slug: string[] }> = [];
    const walk = (segments: string[], node: CatalogTaxonomyNode) => {
      paths.push({ slug: [...segments, node.slug] });
      node.children.forEach((child) => walk([...segments, node.slug], child));
    };
    tree.forEach((root) => walk([], root));
    return paths;
  } catch {
    return [];
  }
}

export default async function CategoryHierarchyPage({ params }: CategoryHierarchyPageProps) {
  const { slug = [] } = await params;
  let routeContext: Awaited<ReturnType<typeof getRouteContext>>;
  try {
    routeContext = await getRouteContext(slug);
  } catch {
    notFound();
  }

  if (!routeContext) {
    notFound();
  }

  return (
    <AppShell>
      <CatalogHierarchyRenderer
        node={routeContext.node}
        breadcrumbs={routeContext.breadcrumbs}
        pathSegments={routeContext.pathSegments}
      />
    </AppShell>
  );
}

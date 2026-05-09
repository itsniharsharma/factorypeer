import CategoryTileCard from "@/components/catalog/category-tile-card";
import { CategoryCompositionComponent } from "@/components/composition";
import { getCompositionBySlugPath } from "@/lib/composition/loader";
import { CatalogBreadcrumb, CatalogTaxonomyNode } from "@/lib/types";

interface CatalogNodeLandingProps {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
}

export async function CatalogNodeLanding({
  node,
  breadcrumbs,
  pathSegments,
}: CatalogNodeLandingProps) {
  const sectionTitle =
    pathSegments.length === 1
      ? "Subcategories"
      : node.children.some((child) => Boolean(child.matrix))
        ? "Child Families"
        : "Child Subcategories";

  // Load composition if it exists for this category
  const slugPath = pathSegments.join("/");
  const composition = await getCompositionBySlugPath(slugPath);

  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">All Products / {breadcrumbs.map((crumb) => crumb.label).join(" / ")}</p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-900">{node.title}</h1>
        <p className="mt-1 text-[11px] font-semibold text-slate-700">{node.productCount.toLocaleString()} Products</p>
        {node.description ? (
          <blockquote className="mt-2 border-l-2 border-slate-100 pl-3 italic text-[13px] text-slate-600">{node.description}</blockquote>
        ) : null}
      </section>

      {/* Render composition if it exists */}
      {composition && (
        <CategoryCompositionComponent
          composition={composition}
          productCount={node.productCount}
        />
      )}

      <section className="grid gap-2 lg:grid-cols-[220px_1fr]">
        <aside className="border border-line bg-white">
          {/* Intentionally empty left sidebar per design: show nothing for now */}
          <div className="h-full p-4">&nbsp;</div>
        </aside>

        <section className="border border-line bg-white p-4">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">{sectionTitle}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {node.children.map((child) => (
              <CategoryTileCard
                key={child.id}
                href={`/category/${[...pathSegments, child.slug].join("/")}`}
                label={child.title}
                image={child.landingImage?.url}
                imageAlt={child.landingImage?.alt}
                subtitle={child.description}
              />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

import CategoryTileCard from "@/components/catalog/category-tile-card";
import { AppShell } from "@/components/layout/app-shell";
import { getTaxonomyTree, sortTaxonomySiblings } from "@/lib/catalog-service";

export const revalidate = 60;

export default async function CategoryIndexPage() {
  const tree = await getTaxonomyTree().catch(() => []);
  const roots = sortTaxonomySiblings(tree);

  return (
    <AppShell>
      <div className="space-y-3">
        <section className="border border-line bg-white px-3 py-3">
          <p className="text-[10px] text-slate-500">All Products</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Category Index</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse all top-level product categories and drill into nested catalog hierarchies.
          </p>
        </section>

        <section className="border border-line bg-white p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {roots.map((root) => (
              <CategoryTileCard
                key={root.id}
                href={`/category/${root.slug}`}
                label={root.title}
                image={root.landingImage?.url}
                imageAlt={root.landingImage?.alt}
                subtitle={root.description}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

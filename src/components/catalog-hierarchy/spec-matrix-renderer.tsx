import { CatalogBreadcrumb, CatalogTaxonomyNode } from "@/lib/types";
import { SpecMatrixTable } from "@/components/catalog-hierarchy/spec-matrix-table";

interface SpecMatrixRendererProps {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
}

export function SpecMatrixRenderer({ node, breadcrumbs }: SpecMatrixRendererProps) {
  if (!node.matrix) return null;

  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">
          All Products / {breadcrumbs.map((crumb) => crumb.label).join(" / ")}
        </p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-900">{node.title}</h1>
        <p className="mt-0.5 text-[11px] text-slate-600">{node.description}</p>
      </section>

      <section className="grid gap-2 lg:grid-cols-[220px_1fr]">
        <aside className="border border-line bg-white">
          <div className="border-b border-line px-2.5 py-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
              Filters
            </h2>
          </div>
          <div className="px-2.5 py-1.5 text-[11px] text-slate-700">
            <p className="font-semibold">Family Filters Placeholder</p>
            <p className="mt-1 text-slate-600">
              Diameter, cut width, shank diameter, coating, and material filters will map to backend facets.
            </p>
          </div>
        </aside>

        <div className="space-y-2">
          <section className="border border-line bg-white px-2.5 py-1.5">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
              Family Overview
            </h2>
            <p className="mt-1 text-[11px] text-slate-700">{node.matrix.familySummary}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-700">
              {node.productCount.toLocaleString()} variant products
            </p>
          </section>
          <SpecMatrixTable matrix={node.matrix} />
        </div>
      </section>
    </div>
  );
}

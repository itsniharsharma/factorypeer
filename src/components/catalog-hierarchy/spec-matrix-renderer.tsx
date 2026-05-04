import { SpecMatrixTable } from "@/components/catalog-hierarchy/spec-matrix-table";
import { DEFAULT_MATRIX_PAGE_SIZE } from "@/lib/catalog-service";
import { CatalogBreadcrumb, CatalogTaxonomyNode } from "@/lib/types";
import Link from "next/link";

interface SpecMatrixRendererProps {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
}

export function SpecMatrixRenderer({ node, breadcrumbs, pathSegments }: SpecMatrixRendererProps) {
  if (!node.matrix) return null;

  const matrix = node.matrix;
  const pageSize = matrix.matrixPageSize ?? DEFAULT_MATRIX_PAGE_SIZE;
  const pageIndex = matrix.matrixPage ?? 0;
  const total = matrix.totalRowCount;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const showPaging = total > pageSize;
  const basePath = `/category/${pathSegments.join("/")}`;
  const pageHref = (p: number) => (p <= 0 ? basePath : `${basePath}?m=${p}`);

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
          {showPaging ? (
            <nav
              className="flex flex-wrap items-center justify-between gap-2 border border-line bg-white px-2.5 py-1.5 text-[11px] text-slate-700"
              aria-label="Spec matrix pages"
            >
              <span className="font-semibold text-slate-800">
                Page {pageIndex + 1} of {totalPages}
                <span className="ml-2 font-normal text-slate-600">
                  (showing {matrix.rows.length.toLocaleString()} of {total.toLocaleString()} rows)
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-1.5">
                {pageIndex > 0 ? (
                  <Link
                    href={pageHref(pageIndex - 1)}
                    className="rounded border border-line bg-white px-2 py-0.5 font-semibold hover:bg-slate-50"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded border border-transparent px-2 py-0.5 text-slate-400">Previous</span>
                )}
                {pageIndex < totalPages - 1 ? (
                  <Link
                    href={pageHref(pageIndex + 1)}
                    className="rounded border border-line bg-white px-2 py-0.5 font-semibold hover:bg-slate-50"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded border border-transparent px-2 py-0.5 text-slate-400">Next</span>
                )}
              </span>
            </nav>
          ) : null}
          <SpecMatrixTable matrix={matrix} />
        </div>
      </section>
    </div>
  );
}

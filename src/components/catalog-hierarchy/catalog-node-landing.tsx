import Image from "next/image";
import CategoryTileCard from "@/components/catalog/category-tile-card";
import { ProductCard } from "@/components/ui/product-card";
import { CatalogBreadcrumb, CatalogTaxonomyNode, Product } from "@/lib/types";

interface CatalogNodeLandingProps {
  node: CatalogTaxonomyNode;
  breadcrumbs: CatalogBreadcrumb[];
  pathSegments: string[];
  bannerImage?: string;
  bannerImageAlt?: string;
  featuredProducts?: Product[];
}

export function CatalogNodeLanding({
  node,
  breadcrumbs,
  pathSegments,
  bannerImage,
  bannerImageAlt,
  featuredProducts = [],
}: CatalogNodeLandingProps) {
  const sectionTitle =
    pathSegments.length === 1
      ? "Subcategories"
      : node.children.some((child) => Boolean(child.matrix))
        ? "Child Families"
        : "Child Subcategories";

  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">
          All Products / {breadcrumbs.map((crumb) => crumb.label).join(" / ")}
        </p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-900">{node.title}</h1>
        <p className="mt-0.5 text-[11px] text-slate-600">{node.description}</p>
        <p className="mt-1 text-[11px] font-semibold text-slate-700">
          {node.productCount.toLocaleString()} Products
        </p>
        {bannerImage ? (
          <div className="relative mt-2 h-[180px] w-full overflow-hidden rounded-sm border border-slate-200">
            <Image
              src={bannerImage}
              alt={bannerImageAlt?.trim() || `${node.title} banner`}
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        ) : null}
      </section>

      <section className="grid gap-2 lg:grid-cols-[220px_1fr]">
        <aside className="border border-line bg-white">
          <div className="border-b border-line px-2.5 py-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
              Filters
            </h2>
          </div>
          <div className="px-2.5 py-1.5 text-[11px] text-slate-600">
            Filter sidebar placeholder for backend-driven facets.
          </div>
          {node.filters?.map((group) => (
            <div key={group.id} className="border-t border-line px-2.5 py-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700">
                {group.label}
              </h3>
              <ul className="mt-1 space-y-0.5">
                {group.options.map((option) => (
                  <li key={option.id} className="text-[11px] text-slate-700">
                    {option.label} <span className="text-slate-500">({option.count})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <section className="border border-line bg-white p-2.5">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
            {sectionTitle}
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
              {node.children.map((child) => (
                <CategoryTileCard
                  key={child.id}
                  href={`/category/${[...pathSegments, child.slug].join("/")}`}
                  label={child.title}
                  image={undefined}
                  subtitle={child.description}
                  count={child.productCount}
                />
              ))}
          </div>
        </section>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="border border-line bg-white p-2.5">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
            Featured Products
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

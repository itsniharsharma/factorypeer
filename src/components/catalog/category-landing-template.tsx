import { ProductCard } from "@/components/ui/product-card";
import CategoryTileCard from "@/components/catalog/category-tile-card";
import { CatalogCategoryPageData } from "@/lib/types";

interface CategoryLandingTemplateProps {
  data: CatalogCategoryPageData;
}

export function CategoryLandingTemplate({ data }: CategoryLandingTemplateProps) {
  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">All Products / {data.title}</p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-900">{data.title}</h1>
        <p className="mt-0.5 text-[11px] text-slate-600">{data.description}</p>
      </section>

      <section className="border border-line bg-white p-2.5">
        <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
          Subcategories
        </h2>
        <div className="grid gap-x-3 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data.subcategories.map((subcategory) => (
            <a
              key={subcategory.id}
              href={`/products/${subcategory.slug}`}
              className="text-[11px] text-slate-700 hover:text-brand hover:underline"
            >
              {subcategory.label}
              {subcategory.count ? <span className="text-slate-500"> ({subcategory.count.toLocaleString()})</span> : ""}
            </a>
          ))}
        </div>
      </section>

      <section className="border border-line bg-white p-2.5">
        <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
          Featured Subcategories
        </h2>
        <div className="grid grid-cols-3 gap-1.5 md:grid-cols-4 xl:grid-cols-8">
          {data.featuredSubcategories.map((subcategory) => (
            <CategoryTileCard
              key={subcategory.id}
              href={subcategory.href}
              label={subcategory.label}
              image={subcategory.image}
              imageAlt={subcategory.imageAlt}
              compact
            />
          ))}
        </div>
      </section>

      <section className="border border-line bg-white p-2.5">
        <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
          Related Categories
        </h2>
        <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {data.relatedCategories.map((category) => (
            <CategoryTileCard
              key={category.id}
              href={`/category/${category.slug}`}
              label={category.label}
            />
          ))}
        </div>
      </section>

      {data.featuredProducts.length > 0 ? (
        <section className="border border-line bg-white p-2.5">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
              Featured Products
            </h2>
            <a href="#" className="text-[11px] font-semibold text-brand hover:underline">
              View More
            </a>
          </div>
          <div className="grid gap-1.5 lg:grid-cols-5">
            {data.featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

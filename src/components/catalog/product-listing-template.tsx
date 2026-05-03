import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProductListingPageData } from "@/lib/types";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

interface ProductListingTemplateProps {
  data: ProductListingPageData;
}

export function ProductListingTemplate({ data }: ProductListingTemplateProps) {
  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">{data.breadcrumbs.join(" / ")}</p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-900">{data.title}</h1>
      </section>

      <section className="grid gap-2 lg:grid-cols-[220px_1fr]">
        <aside className="border border-line bg-white">
          <div className="border-b border-line px-2.5 py-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">Filters</h2>
          </div>
          <div className="space-y-0">
            {data.filters.map((filter) => (
              <div key={filter.id} className="border-b border-line px-2.5 py-1.5 last:border-b-0">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700">
                  {filter.label}
                </h3>
                <ul className="mt-1 space-y-0.5">
                  {filter.options.map((option) => (
                    <li key={option.id}>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <input type="checkbox" className="h-3 w-3 rounded border-line" />
                        <span className="leading-tight">
                          {option.label} <span className="text-slate-500">({option.count})</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border border-line bg-white px-2.5 py-1.5">
            <p className="text-[11px] font-semibold text-slate-700">
              {data.resultCount.toLocaleString()} Results
            </p>
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-semibold text-slate-700">Sort:</label>
              <select className="h-7 border border-line bg-white px-2 text-[11px] text-slate-700">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <div className="flex items-center overflow-hidden border border-line">
                <button className="h-7 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                  Grid
                </button>
                <button className="h-7 border-l border-line px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                  List
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {data.products.map((product) => (
              <article key={product.id} className="grid grid-cols-[100px_1fr_200px] gap-2 border border-line bg-white p-1.5">
                <div className="relative h-20 overflow-hidden border border-line bg-slate-50">
                  <Image
                    src={product.thumbnail ?? getDefaultCatalogImageUrl()}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {product.slug ? (
                      <Link href={`/product/${product.slug}`} className="hover:text-brand hover:underline">
                        {product.title}
                      </Link>
                    ) : (
                      product.title
                    )}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-600 leading-tight">
                    Item #: {product.itemNumber ?? product.sku} | SKU: {product.sku}
                  </p>
                  <p className="text-[10px] text-slate-600">Mfr: {product.manufacturer}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-700">{product.shortSpec}</p>
                  <div className="mt-1">
                    <StatusBadge status={product.status} />
                  </div>
                </div>
                <div className="justify-self-end border border-line bg-slate-50 p-1.5">
                  <p className="text-[10px] text-slate-500">Web Price</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {product.price}
                    <span className="text-[10px] font-medium text-slate-600"> / {product.uom}</span>
                  </p>
                  <div className="mt-1.5 grid grid-cols-[50px_1fr] gap-1">
                    <Input defaultValue="1" aria-label="Quantity" className="h-7 px-1.5 text-xs" />
                    <Button variant="primary" size="sm" className="h-7 text-[11px]">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center border border-line bg-white px-2.5 py-1.5">
            <button className="h-7 border border-line bg-white px-3 text-[11px] font-semibold text-slate-800 hover:bg-slate-100">
              Load More Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

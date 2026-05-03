import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchCatalogProduct } from "@/lib/types";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

interface SearchFacet {
  id: string;
  label: string;
  options: Array<{ id: string; label: string; count: number }>;
}

interface SearchResultsTemplateProps {
  query: string;
  results: SearchCatalogProduct[];
  facets: SearchFacet[];
}

export function SearchResultsTemplate({ query, results, facets }: SearchResultsTemplateProps) {
  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">All Products / Search</p>
        <h1 className="mt-0.5 text-lg font-bold text-slate-900">Search Results</h1>
        <p className="mt-0.5 text-[11px] text-slate-700">
          {results.length.toLocaleString()} results for <span className="font-mono text-slate-900">{query}</span>
        </p>
      </section>

      <section className="grid gap-2 lg:grid-cols-[200px_1fr]">
        <aside className="border border-line bg-white">
          <div className="border-b border-line px-2 py-0.5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">Filters</h2>
          </div>
          {facets.map((facet) => (
            <div key={facet.id} className="border-b border-line px-2 py-1 last:border-b-0">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700">
                {facet.label}
              </h3>
              <ul className="mt-0.5 space-y-0.25">
                {facet.options.map((option) => (
                  <li key={option.id}>
                    <label className="flex items-center gap-1 text-[10px] text-slate-700">
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
        </aside>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5 border border-line bg-white px-2 py-1">
            <p className="text-[10px] font-semibold text-slate-700">
              {results.length.toLocaleString()} Results
            </p>
            <div className="flex items-center gap-1">
              <label className="text-[10px] font-semibold text-slate-700">Sort:</label>
              <select className="h-6 border border-line bg-white px-1.5 text-[10px] text-slate-700">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="border border-line bg-white px-2 py-2 text-[11px] text-slate-700">
              No matches found. Try SKU, item#, or product name.
            </div>
          ) : (
            <div className="space-y-0.5">
              {results.map((product) => (
                <article key={product.id} className="grid grid-cols-[90px_1fr_180px] gap-1.5 border border-line bg-white p-1">
                  <div className="relative h-16 overflow-hidden border border-line bg-slate-50">
                    <Image
                      src={product.thumbnail ?? getDefaultCatalogImageUrl()}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <a href={`/product/${product.slug}`} className="text-sm font-bold leading-tight text-slate-900 hover:text-brand hover:underline">
                      {product.title}
                    </a>
                    <div className="mt-0.5 flex gap-1 text-[10px] font-mono text-slate-600">
                      <span className="font-semibold">SKU:</span>
                      <span>{product.sku}</span>
                      <span className="border-l border-slate-300 pl-1">Item#: {product.itemNumber}</span>
                    </div>
                    <p className="text-[10px] text-slate-600">Mfr: {product.manufacturer} | MPN: {product.mpn}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-slate-700">{product.shortSpec}</p>
                  </div>
                  <div className="justify-self-end border border-line bg-slate-50 p-1">
                    <p className="text-[10px] font-semibold text-emerald-700">{product.availability}</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">
                      {product.price}
                      <span className="text-[9px] font-medium text-slate-600"> / {product.uom}</span>
                    </p>
                    <div className="mt-1 grid grid-cols-[45px_1fr] gap-0.5">
                      <Input defaultValue="1" aria-label="Quantity" className="h-6 px-1 text-[10px]" />
                      <Button variant="primary" size="sm" className="h-6 text-[10px]">
                        Add
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="flex justify-center border border-line bg-white px-2 py-1">
            <button className="h-6 border border-line bg-white px-2.5 text-[10px] font-semibold text-slate-800 hover:bg-slate-100">
              Load More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

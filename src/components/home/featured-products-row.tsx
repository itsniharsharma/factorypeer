import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrefetchLink } from "@/components/ui/prefetch-link";
import { Product } from "@/lib/types";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

interface FeaturedProductsRowProps {
  products: Product[];
}

export function FeaturedProductsRow({ products }: FeaturedProductsRowProps) {
  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-300 px-3 py-2">
        <p className="text-xs text-slate-600">All Products / Featured</p>
        <h2 className="mt-0.5 text-lg font-bold text-slate-900">
          Recently Viewed Products
        </h2>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max border-t border-slate-300">
          {products.map((product) => (
            <article
              key={product.id}
              className="w-[340px] flex-shrink-0 border-r border-slate-300 bg-white last:border-r-0"
            >
              <div className="flex min-h-[300px] flex-col">
                <div className="flex gap-3 px-3 pt-3">
                  <div className="relative h-[86px] w-[86px] flex-shrink-0 overflow-hidden bg-slate-100">
                    <Image
                      src={product.thumbnail ?? getDefaultCatalogImageUrl()}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-700">
                      {product.manufacturer || "Approved Vendor"}
                    </p>
                    <h3 className="mt-1 text-[14px] font-semibold leading-snug text-brand hover:underline">
                      {product.slug ? (
                        <PrefetchLink href={`/product/${product.slug}`}>{product.title}</PrefetchLink>
                      ) : (
                        <span>{product.title}</span>
                      )}
                    </h3>
                    <p className="mt-1 text-[12px] text-slate-600">
                      Item # <span className="font-semibold text-slate-800">{product.itemNumber ?? product.sku}</span>
                    </p>

                    <div className="mt-4">
                      <p className="flex items-center gap-1 text-[12px] text-slate-600">
                        Web Price
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-500 text-[10px] font-bold text-white">
                          i
                        </span>
                      </p>
                      <p className="mt-0.5 flex items-end gap-1 text-[29px] font-bold leading-none text-emerald-700">
                        <span>{product.price}</span>
                        <span className="pb-[2px] text-[12px] font-normal text-slate-600">
                          / {product.uom.toLowerCase()}
                        </span>
                      </p>
                      <p className="mt-1 text-[12px] text-slate-500">
                        Min qty of 1: <span className="font-semibold text-emerald-700">{product.price}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-300 px-3 py-3">
                  <div className="grid grid-cols-[70px_1fr] items-end gap-3">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-slate-600 mb-1">Qty</label>
                      <Input
                        defaultValue="1"
                        aria-label="Qty"
                        className="h-10 rounded-sm px-3 text-sm text-center border border-slate-300"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-10 w-full rounded-sm border border-brand bg-white text-sm font-bold text-brand hover:bg-red-50"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

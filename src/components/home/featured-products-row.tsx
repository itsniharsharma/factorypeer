import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types";

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
              className="w-[312px] flex-shrink-0 border-r border-slate-300 bg-white px-3 py-3 last:border-r-0"
            >
              <div className="grid grid-cols-[72px_1fr] gap-3">
                <div className="relative h-[72px] overflow-hidden rounded-sm bg-slate-100">
                  <Image
                    src={product.thumbnail ?? "/images/product-thumb.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-700">
                    {product.manufacturer || "Approved Vendor"}
                  </p>
                  <h3 className="mt-0.5 text-[12px] font-semibold leading-snug text-brand hover:underline">
                    <a href="#">{product.title}</a>
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Item # <span className="font-semibold text-slate-800">{product.itemNumber ?? product.sku}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[11px] text-slate-600">
                  Web Price <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-500 text-[9px] font-bold text-white">i</span>
                </p>
                <p className="mt-0.5 text-[31px] font-bold text-emerald-700">
                  {product.price} <span className="text-[11px] font-normal text-slate-600">/ {product.uom.toLowerCase()}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Min qty of 1: <span className="font-semibold text-emerald-700">{product.price}</span>
                </p>
              </div>

              <div className="mt-3 grid grid-cols-[56px_1fr] gap-2">
                <div>
                  <label className="text-[11px] text-slate-500">Qty</label>
                  <Input defaultValue="1" aria-label="Qty" className="h-9 rounded-sm px-2 text-sm" />
                </div>
                <div className="pt-[15px]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 w-full rounded-sm border-brand bg-white text-sm font-bold text-brand hover:bg-red-50"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

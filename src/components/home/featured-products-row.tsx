import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types";

interface FeaturedProductsRowProps {
  products: Product[];
}

export function FeaturedProductsRow({ products }: FeaturedProductsRowProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Recently Viewed and Featured Products
        </h2>
        <a href="#" className="text-xs font-semibold text-brand hover:underline">
          View More
        </a>
      </div>
      <div className="grid gap-2 lg:grid-cols-5">
        {products.map((product) => (
          <article key={product.id} className="rounded-sm border border-line bg-white p-2">
            <div className="relative h-24 overflow-hidden rounded-sm border border-line bg-slate-50">
              <Image
                src={product.thumbnail ?? "/images/product-thumb.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-1.5 min-h-8 text-xs font-semibold leading-tight text-slate-900">
              {product.title}
            </h3>
            <p className="mt-1 text-[11px] text-slate-600">
              Item #: {product.itemNumber ?? product.sku}
            </p>
            <p className="text-[11px] text-slate-600">SKU: {product.sku}</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {product.price} <span className="text-xs font-medium text-slate-600">/ {product.uom}</span>
            </p>
            <div className="mt-1.5 grid grid-cols-[52px_1fr] gap-1.5">
              <Input defaultValue="1" aria-label="Quantity" className="h-8 px-2 text-xs" />
              <Button variant="primary" size="sm" className="h-8 text-xs">
                Add to Cart
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

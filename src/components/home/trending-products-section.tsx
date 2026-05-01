import { ProductCard } from "@/components/ui/product-card";
import { Product } from "@/lib/types";

interface TrendingProductsSectionProps {
  products: Product[];
}

export function TrendingProductsSection({ products }: TrendingProductsSectionProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
          Featured and Trending Industrial Products
        </h2>
        <a href="#" className="text-xs font-semibold text-brand hover:underline">
          View Product Feed
        </a>
      </div>
      <div className="grid gap-1.5 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

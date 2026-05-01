import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { StatusBadge } from "@/components/ui/status-badge";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-sm border border-line bg-white p-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold leading-tight text-slate-900">{product.title}</h3>
          <p className="mt-1 text-[11px] text-slate-600">
            SKU: {product.sku} | Mfr: {product.manufacturer}
          </p>
        </div>
        <StatusBadge status={product.status} />
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
        <div className="rounded-sm border border-line bg-slate-50 px-2 py-1">
          <p className="text-slate-500">Unit Price</p>
          <p className="font-bold text-slate-900">
            {product.price} / {product.uom}
          </p>
        </div>
        <div className="rounded-sm border border-line bg-slate-50 px-2 py-1">
          <p className="text-slate-500">Lead Time</p>
          <p className="font-semibold text-slate-900">{product.leadTime}</p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <QuantitySelector value={1} />
        <Button variant="primary" size="sm">
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/lib/types";
import { calculateCartSubtotal, formatCurrency } from "@/lib/cart-data";

interface CartSummaryPanelProps {
  items: CartLineItem[];
  rfqNote: string;
}

export function CartSummaryPanel({ items, rfqNote }: CartSummaryPanelProps) {
  const subtotal = calculateCartSubtotal(items);
  const estimatedItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="space-y-2 border border-line bg-white p-2.5">
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">Order Summary</h2>
      <div className="space-y-1.5 border border-line bg-slate-50 p-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Estimated Items</span>
          <span className="font-semibold text-slate-900">{estimatedItems}</span>
        </div>
      </div>
      <div className="border border-line bg-slate-50 p-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">RFQ Note</p>
        <p className="mt-1 text-[11px] leading-snug text-slate-700">{rfqNote}</p>
      </div>
      <Button variant="primary" size="sm" className="h-8 w-full text-xs">
        Proceed to Quote Request
      </Button>
    </aside>
  );
}

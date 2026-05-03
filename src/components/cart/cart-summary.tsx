import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  itemCount: number;
  subtotal: string;
}

export function CartSummary({ itemCount, subtotal }: CartSummaryProps) {
  return (
    <aside className="w-[320px] shrink-0 rounded-sm border border-slate-200 bg-white px-4 py-4">
      <h2 className="text-lg font-bold text-slate-900">Summary</h2>

      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{subtotal}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Estimated Total Items</span>
          <span className="font-semibold text-slate-900">{itemCount}</span>
        </div>

        <div>
          <p className="font-semibold text-sm text-slate-900">Procurement Note</p>
          <p className="mt-1 text-xs text-slate-600">Add supplier, delivery, or project notes here before requesting a quote.</p>
        </div>
      </div>

      <div className="mt-5">
        <Button className="w-full h-11 rounded-sm bg-brand text-white font-bold">Proceed to Quote Request</Button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <button className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-left text-slate-700">Save Cart as List</button>
        <button className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-left text-slate-700">Export CSV (placeholder)</button>
        <button className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-left text-slate-700">Upload Bulk SKU List (placeholder)</button>
      </div>
    </aside>
  );
}

export default CartSummary;

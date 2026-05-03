import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/lib/mock-cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  return (
    <div className="flex items-stretch gap-4 border-b border-slate-200 px-3 py-3">
      <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-sm bg-slate-100">
        <Image
          src={item.thumbnail ?? "/images/product-thumb.svg"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-700">{item.manufacturer}</p>
        <div className="mt-1 flex items-start gap-4 flex-1">
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">
              <a href="#" className="hover:underline">{item.title}</a>
            </h3>
            <p className="mt-1 text-[12px] text-slate-600">Item # <span className="font-semibold text-slate-800">{item.itemNumber ?? item.sku}</span></p>
          </div>

          <div className="ml-auto text-right">
            <p className="text-[11px] text-slate-600">Unit Price</p>
            <p className="text-[18px] font-bold text-emerald-700">{item.price} <span className="text-[12px] font-normal text-slate-600">/ {item.uom.toLowerCase()}</span></p>
            <p className="mt-1 text-[12px] text-slate-500">Min qty of 1: <span className="font-semibold text-emerald-700">{item.price}</span></p>
          </div>
        </div>

        <div className="border-t border-slate-300 mt-3 pt-3">
          <div className="grid grid-cols-[70px_1fr_60px] items-end gap-3">
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">Qty</label>
              <Input defaultValue={String(item.quantity)} aria-label="Qty" className="h-10 rounded-sm px-3 text-sm text-center border border-slate-300" />
            </div>

            <Button variant="secondary" size="sm" className="h-10 w-full rounded-sm border border-brand bg-white text-sm font-bold text-brand hover:bg-red-50">
              Add to Cart
            </Button>

            <button className="text-xs text-slate-500 hover:text-slate-800 h-10 flex items-center justify-center">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItemRow;

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartLineItem } from "@/lib/types";
import { formatCurrency } from "@/lib/cart-data";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

interface CartTableProps {
  items: CartLineItem[];
}

export function CartTable({ items }: CartTableProps) {
  return (
    <section className="overflow-x-auto border border-line bg-white">
      <table className="min-w-[920px] w-full border-collapse">
        <thead className="border-b border-line bg-slate-50">
          <tr className="text-left">
            <th className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Product
            </th>
            <th className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              SKU / Item
            </th>
            <th className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Unit Price
            </th>
            <th className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Qty
            </th>
            <th className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Extended
            </th>
            <th className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Remove
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-2 py-6 text-center text-sm text-slate-500">
                Your cart is empty.
              </td>
            </tr>
          ) : null}
          {items.map((item) => {
            const extended = item.unitPrice * item.quantity;
            return (
              <tr key={item.id} className="border-b border-line last:border-b-0">
                <td className="px-2 py-1.5 align-top">
                  <div className="grid grid-cols-[64px_1fr] gap-2">
                    <div className="relative h-14 overflow-hidden border border-line bg-slate-50">
                      <Image
                        src={item.thumbnail ?? getDefaultCatalogImageUrl()}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-xs font-semibold text-slate-900 hover:text-brand hover:underline"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-1.5 align-top text-[11px] text-slate-700">
                  <p>SKU: {item.sku}</p>
                  <p>Item #: {item.itemNumber}</p>
                </td>
                <td className="px-2 py-1.5 align-top text-xs font-semibold text-slate-900">
                  {formatCurrency(item.unitPrice)} / {item.uom}
                </td>
                <td className="px-2 py-1.5 align-top">
                  <Input
                    defaultValue={String(item.quantity)}
                    aria-label={`Quantity for ${item.title}`}
                    className="h-7 w-16 px-1.5 text-xs"
                  />
                </td>
                <td className="px-2 py-1.5 align-top text-xs font-bold text-slate-900">
                  {formatCurrency(extended)}
                </td>
                <td className="px-2 py-1.5 align-top">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] text-rose-700">
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

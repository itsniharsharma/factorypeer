import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-2 border border-line bg-white px-2.5 py-1.5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Shopping Cart</h1>
        <p className="text-[11px] text-slate-600">{itemCount} total line items</p>
      </div>
      <Link href="/category/electrical">
        <Button variant="secondary" size="sm" className="h-8 text-xs">
          Continue Shopping
        </Button>
      </Link>
    </section>
  );
}

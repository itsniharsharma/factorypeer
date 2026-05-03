import { CartHeader } from "@/components/cart/cart-header";
import { CartProcurementActions } from "@/components/cart/cart-procurement-actions";
import { CartSummaryPanel } from "@/components/cart/cart-summary-panel";
import { CartTable } from "@/components/cart/cart-table";
import { CartPageData } from "@/lib/types";

interface CartPageTemplateProps {
  data: CartPageData;
}

export function CartPageTemplate({ data }: CartPageTemplateProps) {
  return (
    <div className="space-y-2">
      <CartHeader itemCount={data.lineItems.length} />
      <section className="grid gap-2 lg:grid-cols-[1fr_300px]">
        <div className="space-y-2">
          <CartTable items={data.lineItems} />
          <CartProcurementActions />
        </div>
        <CartSummaryPanel items={data.lineItems} rfqNote={data.rfqNote} />
      </section>
    </div>
  );
}

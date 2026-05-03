import { CartPageTemplate } from "@/components/cart/cart-page-template";
import { AppShell } from "@/components/layout/app-shell";
import { cartPageData } from "@/lib/cart-data";

export default function CartPage() {
  return (
    <AppShell>
      <CartPageTemplate data={cartPageData} />
    </AppShell>
  );
}

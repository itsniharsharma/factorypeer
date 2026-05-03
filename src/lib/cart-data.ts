import { CartLineItem, CartPageData } from "@/lib/types";

/** Cart hydration should be session/user-backed; no hardcoded line-items. */
export const cartLineItems: CartLineItem[] = [];

export const cartPageData: CartPageData = {
  lineItems: cartLineItems,
  rfqNote:
    "Need project-level pricing or high-volume contract terms? Submit this cart for RFQ review.",
};

export function calculateCartSubtotal(items: CartLineItem[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

import { CartLineItem, CartPageData } from "@/lib/types";

export const cartLineItems: CartLineItem[] = [
  {
    id: "cart-1",
    slug: "eaton-fd3100-breaker",
    title: "Eaton Molded Case Circuit Breaker FD3100 3-Pole 100A",
    sku: "FD3100",
    itemNumber: "10A547",
    thumbnail: "/images/product-thumb.svg",
    unitPrice: 289.0,
    uom: "Each",
    quantity: 2,
  },
  {
    id: "cart-2",
    slug: "siemens-3vl1712-breaker",
    title: "Siemens Sentron Circuit Breaker 3VL 3-Pole 125A",
    sku: "3VL1712",
    itemNumber: "21S330",
    thumbnail: "/images/product-thumb.svg",
    unitPrice: 345.5,
    uom: "Each",
    quantity: 1,
  },
  {
    id: "cart-3",
    slug: "schneider-hja36080-breaker",
    title: "Schneider PowerPact H-Frame Breaker 3-Pole 80A",
    sku: "HJA36080",
    itemNumber: "33H981",
    thumbnail: "/images/product-thumb.svg",
    unitPrice: 318.75,
    uom: "Each",
    quantity: 4,
  },
  {
    id: "cart-4",
    slug: "square-d-qo230-breaker",
    title: "Square D QO Miniature Breaker 2-Pole 30A",
    sku: "QO230",
    itemNumber: "65Q209",
    thumbnail: "/images/product-thumb.svg",
    unitPrice: 29.95,
    uom: "Each",
    quantity: 12,
  },
];

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

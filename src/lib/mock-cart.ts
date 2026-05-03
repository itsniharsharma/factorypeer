import { Product } from "./types";

export interface CartItem extends Product {
  quantity: number;
}

export const mockCartItems: CartItem[] = [
  {
    id: "home-prod-1",
    title: "Siemens SIRIUS Contactor 24V DC",
    sku: "3RT2025-1BB40",
    itemNumber: "61U443",
    manufacturer: "Siemens",
    thumbnail: "/images/product-thumb.svg",
    price: "$94.25",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
    quantity: 1,
  },
  {
    id: "home-prod-2",
    title: "Parker Push-Lok Hose 3/8 in",
    sku: "801-6-BLU",
    itemNumber: "24R992",
    manufacturer: "Parker",
    thumbnail: "/images/product-thumb.svg",
    price: "$212.40",
    uom: "Roll",
    status: "limited",
    leadTime: "1-2 days",
    quantity: 1,
  },
  {
    id: "home-prod-3",
    title: "Honeywell Uvex Face Shield",
    sku: "S8500",
    itemNumber: "33H110",
    manufacturer: "Honeywell",
    thumbnail: "/images/product-thumb.svg",
    price: "$39.90",
    uom: "Each",
    status: "in-stock",
    leadTime: "Ships today",
    quantity: 5,
  },
];

export default mockCartItems;

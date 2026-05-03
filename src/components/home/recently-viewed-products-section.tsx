"use client";

import { useEffect, useState } from "react";
import { FeaturedProductsRow } from "./featured-products-row";
import type { Product } from "@/lib/types";

const KEY = "fp_recently_viewed_slugs";

export function RecentlyViewedProductsSection() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
        const slugs = Array.isArray(raw)
          ? raw.map((x) => String(x).trim()).filter(Boolean).slice(0, 12)
          : [];
        if (!slugs.length) {
          setItems([]);
          return;
        }
        const res = await fetch(`/api/catalog/recently-viewed?ids=${encodeURIComponent(slugs.join(","))}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setItems([]);
          return;
        }
        const rows = (await res.json()) as Product[];
        setItems(Array.isArray(rows) ? rows : []);
      } catch {
        setItems([]);
      }
    };
    void run();
  }, []);

  if (!items?.length) return null;
  return <FeaturedProductsRow products={items} />;
}


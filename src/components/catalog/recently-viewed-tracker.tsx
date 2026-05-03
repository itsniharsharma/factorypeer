"use client";

import { useEffect } from "react";

const KEY = "fp_recently_viewed_slugs";
const LIMIT = 12;

export function RecentlyViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug?.trim()) return;
    try {
      const curr = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
      const list = Array.isArray(curr) ? curr.map((x) => String(x).trim()).filter(Boolean) : [];
      const next = [slug, ...list.filter((x) => x !== slug)].slice(0, LIMIT);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // no-op (private mode / corrupted payload)
    }
  }, [slug]);

  return null;
}


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminApiError, getCategoryTree, listProducts } from "@/lib/admin-api";

export function AdminDashboard() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryRoots, setCategoryRoots] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [tree, prod] = await Promise.all([getCategoryTree(), listProducts({ limit: 1, skip: 0 })]);
        if (cancelled) return;
        setCategoryRoots(tree.length);
        setProductCount(prod.total ?? prod.products.length);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof AdminApiError ? e.message : "Dashboard load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Catalog tools backed by the catalog-admin-api proxy.</p>
        </div>
        <div>
          <Link href="/admin/products" className="rounded-sm bg-brand px-3 py-2 text-white">
            Manage Products
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-800">Products</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "…" : productCount ?? "—"}</p>
          <p className="text-xs text-slate-500">Total (from list endpoint)</p>
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-800">Category roots</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "…" : categoryRoots ?? "—"}</p>
          <p className="text-xs text-slate-500">Top-level taxonomy nodes</p>
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-800">Quick links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link className="text-brand underline" href="/admin/categories">
                Categories
              </Link>
            </li>
            <li>
              <Link className="text-brand underline" href="/admin/spec-schemas">
                Spec schemas
              </Link>
            </li>
            <li>
              <Link className="text-brand underline" href="/admin/spec-rows">
                Spec rows
              </Link>
            </li>
            <li>
              <Link className="text-brand underline" href="/admin/homepage-content">
                Homepage content
              </Link>
            </li>
            <li>
              <Link className="text-brand underline" href="/admin/navigation-content">
                Navigation and footer
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

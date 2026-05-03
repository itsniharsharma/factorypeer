import Link from "next/link";
import { AdminSignOut } from "./admin-sign-out";

export function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
      <div className="px-4 py-6">
        <div className="mb-6 text-sm font-bold text-slate-700">Admin</div>
        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Dashboard</Link>
          <Link href="/admin/categories" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Categories</Link>
          <Link href="/admin/products" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Products</Link>
          <Link href="/admin/spec-schemas" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Spec Schemas</Link>
          <Link href="/admin/spec-rows" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Spec Rows</Link>
          <Link href="/admin/homepage-content" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Homepage Content</Link>
          <Link href="/admin/navigation-content" className="block rounded-sm px-3 py-2 hover:bg-slate-50">Navigation & Footer</Link>
        </nav>
        <AdminSignOut />
      </div>
    </aside>
  );
}

export default AdminSidebar;

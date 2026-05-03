import AdminShell from "@/components/admin/admin-shell";
import { Toaster } from "sonner";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const route = hdrs.get("x-factorypeer-admin-route") ?? "app";
  const isLogin = route === "login";

  return (
    <>
      {isLogin ? (
        <div className="min-h-screen bg-slate-50 px-4 py-10">{children}</div>
      ) : (
        <AdminShell>{children}</AdminShell>
      )}
      <Toaster richColors position="top-right" />
    </>
  );
}

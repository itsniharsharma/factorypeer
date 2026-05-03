"use client";

export function AdminSignOut() {
  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="mt-6 w-full rounded-sm border border-slate-300 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
    >
      Sign out
    </button>
  );
}

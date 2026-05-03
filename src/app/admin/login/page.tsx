"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") ?? "/admin";
  const [token, setToken] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        setErr(j.message ?? `Sign-in failed (${res.status})`);
        setPending(false);
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <h1 className="text-xl font-bold text-slate-900">Admin sign-in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the operator token configured as <code className="text-xs">NEXT_ADMIN_TOKEN</code> on the server.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="text-slate-700">Token</span>
          <input
            type="password"
            autoComplete="off"
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 font-mono text-sm"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste shared secret"
          />
        </label>
        {err ? <p className="text-sm text-rose-600">{err}</p> : null}
        <button
          type="submit"
          disabled={pending || !token.trim()}
          className="w-full rounded-sm bg-slate-900 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-slate-600">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}

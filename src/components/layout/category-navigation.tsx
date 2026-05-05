"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MegaMenuRootGroup } from "@/lib/types";

type MegaMenuPayload = {
  groups: MegaMenuRootGroup[];
  utilityLinks: Array<{ label: string; href: string }>;
};

export function CategoryNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [megaMenu, setMegaMenu] = useState<MegaMenuPayload | null>(null);
  const [menuError, setMenuError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog/mega-menu")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: MegaMenuPayload) => {
        if (!cancelled) {
          setMegaMenu({
            groups: Array.isArray(data.groups) ? data.groups : [],
            utilityLinks: Array.isArray(data.utilityLinks) ? data.utilityLinks : [],
          });
          setMenuError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMegaMenu({ groups: [], utilityLinks: [] });
          setMenuError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = megaMenu?.groups ?? [];
  const utilityLinks = megaMenu?.utilityLinks ?? [];

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openFromTrigger = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const handleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setIsOpen(false), 120);
  };

  return (
    <nav className="relative border-b border-slate-400 bg-slate-800">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center px-3">
        <div className="relative" onMouseLeave={handleClose}>
          <button
            type="button"
            aria-expanded={isOpen}
            onMouseEnter={openFromTrigger}
            className={cn(
              "inline-flex h-10 w-fit items-center justify-start gap-1 px-0 text-xs font-bold whitespace-nowrap",
              isOpen ? "bg-white text-slate-900" : "bg-slate-800 text-slate-100",
            )}
          >
            All Products
            <span className={cn("text-[10px] transition-transform", isOpen && "rotate-180")}>▼</span>
          </button>

          <div
            className={cn(
              "pointer-events-none absolute left-0 top-10 z-[80] pt-1 transition-all duration-150",
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            )}
          >
            <section
              className={cn(
                "pointer-events-auto w-[min(100vw-28px,1200px)] max-w-[calc(100vw-28px)] border border-line bg-white shadow-[0_10px_28px_rgba(15,23,42,0.16)]",
                "max-h-[min(100vh-120px,560px)] overflow-y-auto",
              )}
            >
              <div className="border-b border-line px-4 py-3">
                <h2 className="text-[28px] leading-none font-bold text-slate-800">All Products</h2>
                {utilityLinks.length > 0 ? (
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    {utilityLinks.map((link) => (
                      <a
                        key={link.label + link.href}
                        href={link.href || "#"}
                        className="text-xs font-semibold text-slate-700 hover:text-brand hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
                {menuError ? (
                  <p className="mt-2 text-xs text-amber-800">Catalog menu unavailable — check API connection.</p>
                ) : null}
              </div>

              <div className="px-3 py-4">
                {groups.length === 0 && !menuError ? (
                  <p className="px-1 text-xs text-slate-500">Loading catalog…</p>
                ) : null}
                {groups.length === 0 && menuError ? (
                  <p className="px-1 text-xs text-slate-500">No category menu to display.</p>
                ) : null}
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {groups.map((g) => (
                    <div key={g.root.id} className="min-w-0">
                      <Link
                        href={g.root.href}
                        className="block text-sm font-bold leading-tight text-slate-900 hover:text-brand hover:underline"
                      >
                        {g.root.label}
                      </Link>
                      <ul className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                        {g.children.length === 0 ? (
                          <li className="text-[10px] text-slate-400">No subcategories</li>
                        ) : (
                          g.children.map((c) => (
                            <li key={c.id}>
                              <Link
                                href={c.href}
                                className="text-xs leading-snug text-slate-700 hover:text-brand hover:underline"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </nav>
  );
}

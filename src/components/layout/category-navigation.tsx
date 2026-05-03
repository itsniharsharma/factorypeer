"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CatalogNavLinkItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type MegaMenuPayload = {
  columns: CatalogNavLinkItem[][];
  previewLinks: CatalogNavLinkItem[];
  utilityLinks: Array<{ label: string; href: string }>;
};

const megaMenuUtilityLinksFallback = [
  { label: "Purchased Products", href: "/purchased-products" },
  { label: "Custom Product Center", href: "/custom-product-center" },
  { label: "Replacement Parts", href: "/replacement-parts" },
  { label: "Digital Catalogs", href: "/digital-catalogs" },
];

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
            columns: data.columns ?? [],
            previewLinks: data.previewLinks ?? [],
            utilityLinks: data.utilityLinks ?? [],
          });
          setMenuError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMegaMenu({ columns: [], previewLinks: [], utilityLinks: [] });
          setMenuError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const megaMenuColumns = megaMenu?.columns ?? [];
  const previewLinks = megaMenu?.previewLinks ?? [];
  const utilityLinks = megaMenu?.utilityLinks?.length
    ? megaMenu.utilityLinks
    : megaMenuUtilityLinksFallback;

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
      <div className="mx-auto grid h-10 max-w-[1440px] grid-cols-[136px_1fr] items-center gap-2 px-3">
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
                "pointer-events-auto w-[980px] max-w-[calc(100vw-28px)] border border-line bg-white shadow-[0_10px_28px_rgba(15,23,42,0.16)]",
                "max-h-[520px] overflow-auto",
              )}
            >
              <div className="border-b border-line px-4 py-3">
                <h2 className="text-[28px] leading-none font-bold text-slate-800">All Products</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  {utilityLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href || "#"}
                      className="text-xs font-semibold text-slate-700 hover:text-brand hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                {menuError ? (
                  <p className="mt-2 text-xs text-amber-800">Catalog menu unavailable — check API connection.</p>
                ) : null}
              </div>

              <div className="grid gap-0 md:grid-cols-3 xl:grid-cols-4">
                {megaMenuColumns.length === 0 && !menuError ? (
                  <div className="col-span-full px-4 py-6 text-xs text-slate-500">Loading catalog…</div>
                ) : null}
                {megaMenuColumns.map((column, index) => (
                  <ul key={index} className="border-r border-line px-4 py-3 last:border-r-0">
                    {column.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-[2px] px-1 py-[3px] text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                            item.isHeader && "font-semibold",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto">
          {previewLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="whitespace-nowrap text-[11px] font-semibold text-slate-100 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

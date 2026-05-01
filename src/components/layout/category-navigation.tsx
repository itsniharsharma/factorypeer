 "use client";

import { useRef, useState } from "react";
import {
  megaMenuCategoryColumns,
  megaMenuUtilityLinks,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CategoryNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleOpen = () => {
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
            onMouseEnter={handleOpen}
            className={cn(
              "inline-flex h-10 w-fit items-center justify-start gap-1 px-0 text-xs font-bold whitespace-nowrap",
               isOpen ? "bg-white text-slate-900" : "bg-slate-800 text-slate-100",
            )}
          >
            All Products
            <span className={cn("text-[10px] transition-transform", isOpen && "rotate-180")}>
              ▼
            </span>
          </button>

          <div
            className={cn(
              "pointer-events-none absolute left-0 top-10 z-[80] pt-1 transition-all duration-150",
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            )}
            onMouseEnter={handleOpen}
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
                  {megaMenuUtilityLinks.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-xs font-semibold text-slate-700 hover:text-brand hover:underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-3 xl:grid-cols-4">
                {megaMenuCategoryColumns.map((column, index) => (
                  <ul key={index} className="border-r border-line px-4 py-3 last:border-r-0">
                    {column.map((item, itemIndex) => (
                      <li key={item}>
                        <a
                          href="#"
                          className={cn(
                            "block rounded-[2px] px-1 py-[3px] text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                            itemIndex === 0 && "font-semibold",
                          )}
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div />
      </div>

    </nav>
  );
}

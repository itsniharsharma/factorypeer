import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import Link from "next/link";

export function MainHeader() {
  return (
    <header className="border-b border-slate-700 bg-slate-950">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex flex-col hover:opacity-80 transition-opacity">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Industrial Supply
            </p>
            <p className="text-base font-extrabold tracking-tight text-white">FACTORYPEER</p>
          </Link>
          <nav className="hidden gap-6 text-xs font-semibold text-slate-300 lg:flex">
            <a href="#" className="hover:text-white">Catalog</a>
            <a href="#" className="hover:text-white">KeepStock</a>
            <a href="#" className="hover:text-white">Help</a>
            <a href="#" className="hover:text-white">1-800-SUPPLY</a>
          </nav>
        </div>

        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="sm" className="hidden text-xs text-slate-300 sm:flex">
            Register
          </Button>
          <Button variant="primary" size="sm" className="text-xs font-bold">
            Sign In
          </Button>
          <Link
            href="/cart"
            className="inline-flex h-8 items-center justify-center rounded-sm border border-line bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100"
          >
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}

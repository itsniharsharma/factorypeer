import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

export function MainHeader() {
  return (
    <header className="border-b border-slate-700 bg-slate-950">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Industrial Supply
            </p>
            <p className="text-base font-extrabold tracking-tight text-white">FACTORYPEER</p>
          </div>
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
          <Button variant="secondary" size="sm" className="text-xs">
            Cart
          </Button>
        </div>
      </div>
    </header>
  );
}

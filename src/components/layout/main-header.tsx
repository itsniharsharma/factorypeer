import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

export function MainHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[220px_1fr_260px] items-center gap-4 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Procurement Suite
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-brand">FACTORYPEER</p>
        </div>

        <SearchBar />

        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm">
            Account
          </Button>
          <Button variant="secondary" size="sm">
            Orders
          </Button>
          <Button variant="primary" size="sm">
            Cart (08)
          </Button>
        </div>
      </div>
    </header>
  );
}

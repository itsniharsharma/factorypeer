export function Footer() {
  return (
    <footer className="border-t border-line bg-slate-900 text-slate-100">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 py-6 text-xs md:grid-cols-3">
        <div>
          <p className="font-bold uppercase tracking-wide">Factorypeer</p>
          <p className="mt-1 text-slate-300">Industrial sourcing and procurement workspace.</p>
        </div>
        <div>
          <p className="font-semibold">Support</p>
          <p className="mt-1 text-slate-300">24/7 Technical Desk | procurement@factorypeer.io</p>
        </div>
        <div className="md:text-right">
          <p className="text-slate-300">Contract Terms | Compliance | Supplier Portal</p>
          <p className="mt-1 text-slate-400">2026 Factorypeer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

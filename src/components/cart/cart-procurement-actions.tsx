import { Button } from "@/components/ui/button";

export function CartProcurementActions() {
  return (
    <section className="border border-line bg-white px-2.5 py-1.5">
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
        Procurement Tools
      </h2>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <Button variant="secondary" size="sm" className="h-7 text-[11px]">
          Save Cart as Procurement List
        </Button>
        <Button variant="secondary" size="sm" className="h-7 text-[11px]">
          Export Cart CSV
        </Button>
        <Button variant="secondary" size="sm" className="h-7 text-[11px]">
          Upload Bulk SKU List
        </Button>
      </div>
    </section>
  );
}

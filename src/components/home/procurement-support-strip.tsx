import { Button } from "@/components/ui/button";
import { SupportCTA } from "@/lib/types";

interface ProcurementSupportStripProps {
  ctas: SupportCTA[];
}

export function ProcurementSupportStrip({ ctas }: ProcurementSupportStripProps) {
  return (
    <section className="rounded-sm border border-line bg-slate-900 p-2.5 text-white">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
        Procurement Support
      </h2>
      <div className="mt-1.5 grid gap-1.5 md:grid-cols-2">
        {ctas.map((cta) => (
          <article
            key={cta.id}
            className="flex items-center justify-between gap-3 rounded-sm border border-slate-600 bg-slate-800 p-2"
          >
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200">
                {cta.title}
              </h3>
              <p className="mt-1 text-[11px] leading-snug text-slate-300">{cta.description}</p>
            </div>
            <Button variant="secondary" size="sm" className="shrink-0">
              {cta.action}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

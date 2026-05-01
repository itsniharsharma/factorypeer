import { TrustPoint } from "@/lib/types";

interface TrustSectionProps {
  points: TrustPoint[];
}

export function TrustSection({ points }: TrustSectionProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2.5">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
        Why Procurement Teams Choose Factorypeer
      </h2>
      <div className="mt-1.5 grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
        {points.map((point) => (
          <article key={point.id} className="rounded-sm border border-line bg-slate-50 p-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">
              {point.title}
            </h3>
            <p className="mt-1 text-[11px] leading-snug text-slate-600">{point.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { ServiceOffering } from "@/lib/types";

interface IndustrySolutionsSectionProps {
  solutions: ServiceOffering[];
}

export function IndustrySolutionsSection({ solutions }: IndustrySolutionsSectionProps) {
  return (
    <section className="rounded-sm border border-line bg-slate-50 p-2.5">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
        Industry Solutions and Services
      </h2>
      <div className="mt-1.5 grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
        {solutions.map((solution) => (
          <article key={solution.id} className="rounded-sm border border-line bg-white p-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">
              {solution.title}
            </h3>
            <p className="mt-1 text-[11px] leading-snug text-slate-600">{solution.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { Department } from "@/lib/types";

interface FeaturedDepartmentsSectionProps {
  departments: Department[];
}

export function FeaturedDepartmentsSection({
  departments,
}: FeaturedDepartmentsSectionProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
          Featured Industrial Departments
        </h2>
        <a href="#" className="text-xs font-semibold text-brand hover:underline">
          View All Departments
        </a>
      </div>
      <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
        {departments.map((department) => (
          <article key={department.id} className="rounded-sm border border-line bg-slate-50 p-2">
            <h3 className="text-sm font-bold text-slate-900">{department.name}</h3>
            <p className="mt-1 text-[11px] leading-snug text-slate-600">{department.description}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {department.skuCount.toLocaleString()} SKUs
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { SpecRow } from "@/lib/types";

interface SpecTableProps {
  title?: string;
  rows: SpecRow[];
}

export function SpecTable({ title = "Reference Specifications", rows }: SpecTableProps) {
  return (
    <section className="rounded-sm border border-line bg-white">
      <div className="border-b border-line px-3 py-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th className="w-1/3 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-600">
                {row.label}
              </th>
              <td className="px-3 py-2 text-xs text-slate-900">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

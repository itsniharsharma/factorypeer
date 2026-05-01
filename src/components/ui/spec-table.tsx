import { SpecRow } from "@/lib/types";

interface SpecTableProps {
  title?: string;
  rows: SpecRow[];
}

export function SpecTable({ title = "Reference Specifications", rows }: SpecTableProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">{title}</h3>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th className="w-1/3 bg-slate-50 px-2 py-1.5 text-left text-[11px] font-semibold text-slate-600">
                {row.label}
              </th>
              <td className="px-2 py-1.5 text-[11px] text-slate-900">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { SpecRow } from "@/lib/types";

interface SpecTableProps {
  title?: string;
  rows: SpecRow[];
  emptyMessage?: string;
  /** Dense procurement-style two-column wall on md+ */
  dense?: boolean;
}

export function SpecTable({
  title = "Reference Specifications",
  rows,
  emptyMessage = "No specification rows available.",
  dense = false,
}: SpecTableProps) {
  return (
    <div>
      <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-[11px] leading-snug text-slate-600">{emptyMessage}</p>
      ) : dense ? (
        <ul className="grid gap-0 border border-line md:grid-cols-2 md:divide-x md:divide-line">
          {rows.map((row) => (
            <li
              key={row.label}
              className="grid grid-cols-[minmax(0,38%)_1fr] gap-x-2 border-b border-line bg-white px-2 py-[5px] text-[11px] leading-snug"
            >
              <span className="font-semibold text-slate-600">{row.label}</span>
              <span className="break-words text-slate-900">{row.value}</span>
            </li>
          ))}
        </ul>
      ) : (
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
      )}
    </div>
  );
}

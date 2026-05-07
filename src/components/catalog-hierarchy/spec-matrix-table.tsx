import { CatalogSpecMatrix } from "@/lib/types";
import { cn } from "@/lib/utils";
import SpecMatrixRowClient from "./spec-matrix-row.client";

interface SpecMatrixTableProps {
  matrix: CatalogSpecMatrix;
}

// Server component: render table header and rows server-side. Each row
// is a small client component responsible only for expand/collapse and
// cart interactions. This reduces hydration by keeping table structure on
// the server and isolating interactive islands.
export function SpecMatrixTable({ matrix }: SpecMatrixTableProps) {
  return (
    <section className="overflow-x-auto border border-line bg-white">
      <table className="min-w-[980px] w-full border-collapse">
        <thead className="border-b border-line bg-slate-50">
          <tr>
            <th className="w-9 px-2 py-1 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">
              +
            </th>
            {matrix.columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  "px-2 py-1 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600",
                  column.widthClass,
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <SpecMatrixRowClient key={row.id} row={row} columns={matrix.columns} columnCount={matrix.columns.length} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

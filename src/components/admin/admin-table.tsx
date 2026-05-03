import type { ReactElement } from "react";

interface Column {
  key: string;
  label: string;
}

interface AdminTableProps<T> {
  columns: Column[];
  rows: T[];
  renderRow: (row: T) => ReactElement;
}

export function AdminTable<T>({ columns, rows, renderRow }: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-white">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                {c.label}
              </th>
            ))}
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((r) => renderRow(r))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;

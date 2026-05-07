"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Column {
  id: string;
}

interface Row {
  id: string;
  productSlug?: string;
  productTitle?: string;
  itemNumber?: string;
  sku?: string;
  availability?: string;
  unitPrice?: string;
  values: Record<string, string>;
}

interface Props {
  row: Row;
  columns: Column[];
  columnCount: number;
}

export default function SpecMatrixRowClient({ row, columns, columnCount }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="border-b border-line">
        <td className="px-2 py-1.5 align-top">
          <button
            type="button"
            onClick={() => setIsOpen((s) => !s)}
            className="h-6 w-6 border border-line bg-white text-xs font-bold text-slate-700 hover:bg-slate-100"
            aria-expanded={isOpen}
            aria-controls={`spec-row-${row.id}`}
          >
            {isOpen ? "-" : "+"}
          </button>
        </td>
        {columns.map((column) => (
          <td key={`${row.id}-${column.id}`} className="px-2 py-1.5 align-top text-[11px] text-slate-800">
            {row.values[column.id]}
          </td>
        ))}
      </tr>

      {isOpen ? (
        <tr id={`spec-row-${row.id}`} className="border-b border-line bg-slate-50">
          <td />
          <td colSpan={columnCount} className="px-2 py-2">
            <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <Link
                  href={row.productSlug && row.productSlug !== "—" ? `/product/${row.productSlug}` : "#"}
                  className="text-xs font-bold text-slate-900 hover:text-brand hover:underline"
                >
                  {row.productTitle}
                </Link>
                <p className="mt-0.5 text-[11px] text-slate-600">Item #: {row.itemNumber} | SKU: {row.sku}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">{row.availability}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Qty</p>
                <Input defaultValue="1" className="h-7 w-16 px-1.5 text-xs" />
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900">{row.unitPrice}</p>
                <Button variant="primary" size="sm" className="h-7 text-[11px]">
                  Add to Cart
                </Button>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

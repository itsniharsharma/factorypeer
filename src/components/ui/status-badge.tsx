import { InventoryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InventoryStatus;
}

const statusClassMap: Record<InventoryStatus, string> = {
  "in-stock": "bg-emerald-100 text-emerald-900 border-emerald-300",
  limited: "bg-amber-100 text-amber-900 border-amber-300",
  backorder: "bg-rose-100 text-rose-900 border-rose-300",
};

const statusLabelMap: Record<InventoryStatus, string> = {
  "in-stock": "In Stock",
  limited: "Limited",
  backorder: "Backorder",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
        statusClassMap[status],
      )}
    >
      {statusLabelMap[status]}
    </span>
  );
}

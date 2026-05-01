import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  value: number;
}

export function QuantitySelector({ value }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-sm border border-line bg-white">
      <Button variant="ghost" size="sm" className="rounded-none border-none px-2">
        -
      </Button>
      <span className="min-w-10 border-x border-line px-2 py-1 text-center text-sm font-semibold">
        {value}
      </span>
      <Button variant="ghost" size="sm" className="rounded-none border-none px-2">
        +
      </Button>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "Search by SKU, manufacturer, MPN, or product description",
}: SearchBarProps) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto] gap-2">
      <Input
        aria-label="Search products"
        placeholder={placeholder}
        className="h-11 bg-white"
      />
      <Button variant="primary" size="md" className="h-11 min-w-24">
        Search
      </Button>
    </div>
  );
}

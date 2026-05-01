"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getExactCatalogProductMatch,
  getSearchSuggestions,
} from "@/lib/catalog-data";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "Enter keyword, item, model or part #",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const recentSearches = ["FD3100", "10A547", "HJA36080"];

  const suggestions = useMemo(() => getSearchSuggestions(query), [query]);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const exactMatch = getExactCatalogProductMatch(trimmed);
    if (exactMatch) {
      router.push(`/product/${exactMatch.slug}`);
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className="relative grid w-full grid-cols-[1fr_auto] gap-0" onSubmit={handleSubmit}>
      <Input
        aria-label="Search products"
        placeholder={placeholder}
        className="h-10 rounded-l-none border-r-0 bg-white text-sm"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 120)}
      />
      <Button type="submit" variant="primary" size="sm" className="h-10 rounded-l-none bg-brand px-4 text-sm font-bold">
        🔍
      </Button>

      {isFocused ? (
        <div className="absolute left-0 right-0 top-11 z-[70] col-span-2 border border-line bg-white shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
          {query.trim().length > 0 ? (
            <ul className="max-h-72 overflow-auto">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      onClick={() => router.push(`/product/${suggestion.slug}`)}
                      className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <span className="flex-1 text-sm font-semibold text-slate-900">{suggestion.title}</span>
                      <span className="whitespace-nowrap border-l border-slate-300 pl-2 text-[11px] font-mono text-slate-600">{suggestion.sku}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-slate-600">
                  No matches found. Try SKU or item#.
                </li>
              )}
            </ul>
          ) : (
            <div className="p-3 border-b border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Recent Searches
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentSearches.map((recent) => (
                  <button
                    key={recent}
                    type="button"
                    onClick={() => {
                      setQuery(recent);
                      router.push(`/search?q=${encodeURIComponent(recent)}`);
                    }}
                    className="border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}

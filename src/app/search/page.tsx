import { AppShell } from "@/components/layout/app-shell";
import { SearchResultsTemplate } from "@/components/catalog/search-results-template";
import { searchCatalog } from "@/lib/catalog-service";
import type { SearchCatalogProduct } from "@/lib/types";

export const revalidate = 30;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function buildFacetsFromResults(results: SearchCatalogProduct[]) {
  const manufacturerMap = new Map<string, number>();
  const availabilityMap = new Map<string, number>();

  results.forEach((product) => {
    manufacturerMap.set(
      product.manufacturer,
      (manufacturerMap.get(product.manufacturer) ?? 0) + 1,
    );
    availabilityMap.set(
      product.availability,
      (availabilityMap.get(product.availability) ?? 0) + 1,
    );
  });

  return [
    {
      id: "manufacturer",
      label: "Manufacturer",
      options: Array.from(manufacturerMap.entries()).map(([label, count]) => ({
        id: label.toLowerCase().replace(/\s+/g, "-"),
        label,
        count,
      })),
    },
    {
      id: "availability",
      label: "Availability",
      options: Array.from(availabilityMap.entries()).map(([label, count]) => ({
        id: label.toLowerCase().replace(/\s+/g, "-"),
        label,
        count,
      })),
    },
  ];
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  let results: SearchCatalogProduct[] = [];
  let loadError = false;
  try {
    results = query ? await searchCatalog(query) : [];
  } catch {
    loadError = true;
    results = [];
  }

  const facets = buildFacetsFromResults(results);

  return (
    <AppShell>
      {loadError ? (
        <div className="mb-2 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Search is temporarily unavailable. Check that the catalog API is running and{" "}
          <code className="font-mono text-xs">CATALOG_ADMIN_API_URL</code> is set for the Next.js server.
        </div>
      ) : null}
      <SearchResultsTemplate query={query || "All Catalog"} results={results} facets={facets} />
    </AppShell>
  );
}

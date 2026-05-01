import { AppShell } from "@/components/layout/app-shell";
import { SearchResultsTemplate } from "@/components/catalog/search-results-template";
import { searchCatalogProductsByQuery } from "@/lib/catalog-data";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function buildFacetsFromResults(
  results: ReturnType<typeof searchCatalogProductsByQuery>,
) {
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
  const results = query ? searchCatalogProductsByQuery(query) : [];
  const facets = buildFacetsFromResults(results);

  return (
    <AppShell>
      <SearchResultsTemplate query={query || "All Catalog"} results={results} facets={facets} />
    </AppShell>
  );
}

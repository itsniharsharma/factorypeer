"use server";

import Image from "next/image";
import type {
  OverviewSection,
  FamilySection,
  ComparisonTable,
  FeatureBullet,
  TableColumn,
  TableRow,
  FamilyPreviewCard,
  CategoryComposition,
} from "@/lib/composition/types";

/**
 * Overview section renderer—single per category page.
 * Shows heading, description, product count, and optional preview cards.
 */
export async function OverviewSectionComponent({
  section,
  productCount,
}: {
  section: OverviewSection;
  productCount?: number;
}) {
  const showProductCount = section.productCountMode !== "hidden";

  return (
    <section className="mb-12 border-b pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{section.heading}</h1>

        {showProductCount && productCount !== undefined && (
          <p className="text-gray-600 mb-6">
            {section.productCountMode === "exact"
              ? `${productCount} products`
              : `${Math.round(productCount / 10) * 10}+ products`}
          </p>
        )}

        {section.description && (
          <div className="prose prose-lg mb-8 max-w-4xl">
            <p>{section.description}</p>
          </div>
        )}

        {section.familyPreviewCards && section.familyPreviewCards.length > 0 && (
          <div className="mt-8">
            <p className="text-sm uppercase tracking-wide text-gray-500 mb-4">
              Quick Links
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {section.familyPreviewCards.map((card: FamilyPreviewCard) => (
                <a
                  key={card.familySectionId}
                  href={`#section-${card.familySectionId}`}
                  className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Section: {card.familySectionId}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Family section renderer—repeatable block with table.
 */
export async function FamilySectionComponent({
  section,
}: {
  section: FamilySection;
}) {
  return (
    <section
      id={`section-${section.id}`}
      className="mb-12 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{section.title}</h2>

        {section.image && (
          <div className="mb-6 relative w-full h-96">
            <Image
              src={section.image.url}
              alt={section.image.altText || section.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        )}

        {section.description && (
          <div className="prose prose-lg mb-6 max-w-4xl">
            <p>{section.description}</p>
          </div>
        )}

        {section.featureBullets && section.featureBullets.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-lg mb-4">Key Features</p>
              <ul className="space-y-2">
                {section.featureBullets.map((bullet: FeatureBullet, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {section.table && (
          <ComparisonTableComponent table={section.table} />
        )}
      </div>
    </section>
  );
}

/**
 * Comparison table renderer.
 * Price column always last, required.
 */
export async function ComparisonTableComponent({
  table,
}: {
  table: ComparisonTable;
}) {
  if (!table.columns || table.columns.length === 0 || !table.rows || table.rows.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500">No comparison data available.</p>
      </div>
    );
  }

  // Ensure price column is last
  const priceColumn = table.columns.find((col: TableColumn) => col.isPrice);
  const otherColumns = table.columns.filter((col: TableColumn) => !col.isPrice);
  const orderedColumns = [...otherColumns, ...(priceColumn ? [priceColumn] : [])];

  const readRowValue = (row: TableRow, key: string): string => {
    const values = row.values as unknown;
    if (values instanceof Map) {
      return values.get(key) || "—";
    }
    if (values && typeof values === "object") {
      const raw = (values as Record<string, unknown>)[key];
      return typeof raw === "string" && raw.length > 0 ? raw : "—";
    }
    return "—";
  };

  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            {orderedColumns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-gray-700 ${
                  col.isPrice ? "bg-blue-100 font-bold" : ""
                }`}
                style={{ width: col.width || "auto" }}
              >
                {col.label}
                {col.isMandatory && <span className="text-red-600 ml-1">*</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row: TableRow, rowIdx: number) => (
            <tr
              key={row._id || rowIdx}
              className={`border-b ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
            >
              {orderedColumns.map((col) => (
                <td
                  key={`${row._id || rowIdx}-${col.key}`}
                  className={`px-4 py-3 text-gray-700 ${
                    col.isPrice ? "bg-blue-50 font-semibold text-blue-900" : ""
                  }`}
                >
                  {col.isPrice
                    ? row.price
                    : readRowValue(row, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Full composition page renderer—combines all sections.
 */
export async function CategoryCompositionComponent({
  composition,
  productCount,
}: {
  composition: CategoryComposition;
  productCount?: number;
}) {
  return (
    <div className="py-8">
      <OverviewSectionComponent
        section={composition.overviewSection}
        productCount={productCount}
      />

      {composition.familySections && composition.familySections.length > 0 && (
        <div className="space-y-12">
          {composition.familySections
            .filter((section: FamilySection) => section.publishStatus !== "archived")
            .sort((a: FamilySection, b: FamilySection) => a.sortOrder - b.sortOrder)
            .map((section: FamilySection) => (
              <FamilySectionComponent key={section.id} section={section} />
            ))}
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { SpecTable } from "@/components/ui/spec-table";
import type { ProductDetailPageData } from "@/lib/types";
import { ProductImageGallery } from "./product-image-gallery";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

interface ProductDetailTemplateProps {
  data: ProductDetailPageData;
}

const DOC_LABELS: Record<string, string> = {
  manual: "Manuals",
  datasheet: "Datasheets",
  sds: "Safety data sheets",
  certification: "Certifications",
  drawing: "Drawings",
  other: "Other resources",
};

const DOC_ORDER = ["manual", "datasheet", "sds", "certification", "drawing", "other"];

function groupAttachments(docTypes: ProductDetailPageData["attachments"]) {
  const map = new Map<string, typeof docTypes>();
  for (const a of docTypes) {
    const k = a.docType;
    const list = map.get(k) ?? [];
    list.push(a);
    map.set(k, list);
  }
  return map;
}

export function ProductDetailTemplate({ data }: ProductDetailTemplateProps) {
  const moqLabel = data.moq != null && data.moq > 0 ? String(data.moq) : null;
  const groupedDocs = groupAttachments(data.attachments);

  return (
    <div className="space-y-1.5">
      <header className="border border-line bg-white px-2 py-1.5">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] leading-tight text-slate-600">
            {data.breadcrumbs.map((c, i) => (
              <li key={`${c.href}-${i}`} className="flex items-center gap-1">
                {i > 0 ? <span className="text-slate-400">/</span> : null}
                <Link href={c.href} className="hover:text-brand hover:underline">
                  {c.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-1">
              <span className="text-slate-400">/</span>
              <span className="max-w-[min(100%,52rem)] truncate font-medium text-slate-900">
                {data.title}
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="mt-1 text-base font-bold leading-snug tracking-tight text-slate-900 md:text-[17px]">
          {data.title}
        </h1>
      </header>

      {data.marketingBullets.length > 0 ? (
        <section className="border border-line bg-slate-50 px-2 py-1.5">
          <ul className="columns-1 gap-x-6 text-[11px] text-slate-800 sm:columns-2">
            {data.marketingBullets.map((b) => (
              <li key={b} className="relative pl-3 before:absolute before:left-0 before:top-[0.45em] before:h-1 before:w-1 before:rounded-full before:bg-slate-500">
                {b}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border border-line bg-white">
        <div className="grid xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)_268px] xl:divide-x xl:divide-line">
          <div className="p-2">
            <ProductImageGallery images={data.images} productTitle={data.title} />
          </div>

          <div className="space-y-2 p-2">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px] leading-snug">
              <dt className="text-slate-500">Brand</dt>
              <dd className="font-semibold text-slate-900">{data.brand}</dd>
              <dt className="text-slate-500">Catalog #</dt>
              <dd className="font-semibold text-slate-900">{data.itemNumber}</dd>
              <dt className="text-slate-500">Supplier SKU</dt>
              <dd className="font-mono font-semibold text-slate-900">{data.sku}</dd>
              <dt className="text-slate-500">Mfr. model</dt>
              <dd className="font-semibold text-slate-900">{data.manufacturerModel}</dd>
            </dl>

            <div className="grid gap-1.5 border-t border-line pt-2 sm:grid-cols-2">
              <div className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Lead time
                </p>
                <p className="text-[11px] font-medium text-slate-900">{data.leadTime}</p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Sell unit / pack
                </p>
                <p className="text-[11px] font-medium text-slate-900">{data.packaging}</p>
              </div>
            </div>
            {moqLabel ? (
              <p className="text-[11px] text-slate-700">
                <span className="font-semibold text-slate-900">MOQ:</span> {moqLabel}{" "}
                <span className="text-slate-500">{data.uom}</span>
              </p>
            ) : null}
          </div>

          <aside className="flex flex-col gap-2 border-t border-line bg-slate-50 p-2 xl:border-t-0">
            <div className="rounded-sm border border-emerald-300 bg-emerald-50 px-2 py-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-900">
                Availability
              </p>
              <p className="text-[12px] font-bold leading-tight text-emerald-950">{data.availability}</p>
            </div>

            <div className="space-y-1 border border-line border-dashed border-slate-300 bg-white px-2 py-1.5 text-[10px] leading-snug text-slate-800">
              <p>
                <span className="font-semibold text-slate-700">Est. ship wt.</span>{" "}
                <span className="text-slate-900">{data.shippingWeight}</span>
              </p>
              <p className="border-t border-line pt-1 text-slate-700">
                <span className="font-semibold text-slate-800">Branch / DC</span> — {data.branchAvailability}
              </p>
            </div>

            <ul className="space-y-0.5 border border-line bg-white px-2 py-1.5 text-[10px] text-slate-800">
              {data.logisticsLines.map((line, i) => (
                <li key={`logistics-${i}`} className="flex gap-1.5 border-b border-line py-0.5 last:border-b-0">
                  <span className="w-[42%] shrink-0 font-semibold text-slate-600">{line.label}</span>
                  <span className="min-w-0 leading-snug">{line.value}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-sm border border-line bg-white p-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Web price
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums leading-none text-slate-900">
                {data.price}
                <span className="text-[10px] font-medium text-slate-600"> / {data.uom}</span>
              </p>
              <p className="mt-1 text-[9px] text-slate-500">Tax / freight excluded — quoted at order confirmation.</p>

              <div className="mt-2">
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">Qty</p>
                <QuantitySelector value={1} />
              </div>

              <Button variant="primary" size="sm" className="mt-2 h-8 w-full text-[11px] font-semibold">
                Add to Cart
              </Button>
              <Button variant="secondary" size="sm" className="mt-1 h-8 w-full text-[11px] font-semibold">
                Request RFQ
              </Button>

              <div className="mt-2 grid grid-cols-2 gap-1 border-t border-line pt-2">
                <button
                  type="button"
                  disabled
                  className="h-7 cursor-not-allowed rounded border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-500"
                  title="Lists — enabled with procurement workspace sign-in"
                >
                  Add to list
                </button>
                <button
                  type="button"
                  disabled
                  className="h-7 cursor-not-allowed rounded border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-500"
                  title="Compare — enabled with procurement workspace sign-in"
                >
                  Compare
                </button>
              </div>
              <p className="mt-1 text-[9px] leading-snug text-slate-500">
                Pickup, expedite, and carrier routing — set at checkout / issued PO.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {data.shortDescription ? (
        <section className="border border-line bg-white px-2 py-1.5">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">Overview</h2>
          <p className="mt-1 text-[11px] leading-snug text-slate-800">{data.shortDescription}</p>
        </section>
      ) : null}

      {data.features.length > 0 || data.applications.length > 0 ? (
        <section className="grid gap-1.5 md:grid-cols-2">
          {data.features.length > 0 ? (
            <article className="border border-line bg-white p-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">Features</h2>
              <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-slate-800">
                {data.features.map((f) => (
                  <li key={f} className="flex gap-1.5">
                    <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-slate-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
          {data.applications.length > 0 ? (
            <article className="border border-line bg-white p-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
                Applications
              </h2>
              <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-slate-800">
                {data.applications.map((f) => (
                  <li key={f} className="flex gap-1.5">
                    <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-slate-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}

      <div className="border border-line bg-white p-2">
        <SpecTable
          title="Technical specifications"
          rows={data.specificationRows}
          emptyMessage="No extended specifications on file for this item. See overview and documents."
          dense
        />
      </div>

      {data.longDescription ? (
        <section className="border border-line bg-white p-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">Description</h2>
          <div className="mt-1 whitespace-pre-wrap text-[11px] leading-snug text-slate-800">
            {data.longDescription}
          </div>
        </section>
      ) : null}

      <section className="border border-line bg-white p-2">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
          Documents & resources
        </h2>
        {data.attachments.length === 0 ? (
          <p className="mt-1 text-[11px] leading-snug text-slate-600">
            No downloadable documents listed. Request literature from buyer services.
          </p>
        ) : (
          <div className="mt-1.5 space-y-2">
            {Array.from(groupedDocs.entries())
              .sort(([a], [b]) => DOC_ORDER.indexOf(a) - DOC_ORDER.indexOf(b))
              .map(([docType, items]) => (
                <div key={docType}>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {DOC_LABELS[docType] ?? DOC_LABELS.other}
                  </h3>
                  <ul className="mt-0.5 space-y-0.5">
                    {items.map((document) => (
                      <li key={document.id}>
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-brand hover:underline"
                        >
                          {document.title}
                        </a>
                        <span className="ml-1 text-[9px] uppercase text-slate-500">({document.docType})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </section>

      <ProductRelationSection
        title="Related products"
        products={data.relatedProducts}
        empty="No alternate items configured."
      />
      <ProductRelationSection
        title="Compatible items"
        products={data.compatibleProducts}
        empty="No compatible accessories or mates listed."
      />
      <ProductRelationSection
        title="Recommended"
        products={data.recommendedProducts}
        empty="No recommendations for this item."
      />
    </div>
  );
}

function ProductRelationSection({
  title,
  products,
  empty,
}: {
  title: string;
  products: ProductDetailPageData["relatedProducts"];
  empty: string;
}) {
  return (
    <section className="border border-line bg-slate-50 p-2">
      <div className="mb-1.5 flex items-baseline justify-between gap-2 border-b border-line pb-1">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-800">{title}</h2>
        <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
          {products.length} item{products.length === 1 ? "" : "s"}
        </span>
      </div>
      {products.length === 0 ? (
        <p className="text-[11px] text-slate-600">{empty}</p>
      ) : (
        <ul className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <article className="flex gap-2 border border-line bg-white p-1.5 transition-colors hover:border-slate-400">
                <div className="relative h-14 w-14 shrink-0 border border-line bg-white">
                  <Image
                    src={product.thumbnail ?? getDefaultCatalogImageUrl()}
                    alt={product.title}
                    fill
                    className="object-contain p-0.5"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {product.brand ? (
                    <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                      {product.brand}
                    </p>
                  ) : null}
                  <Link
                    href={product.slug ? `/product/${product.slug}` : "#"}
                    className="line-clamp-2 text-[11px] font-semibold leading-snug text-brand hover:underline"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                    {product.itemNumber ?? product.sku}
                  </p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">
                    {product.price}{" "}
                    <span className="text-[10px] font-medium text-slate-600">/ {product.uom}</span>
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

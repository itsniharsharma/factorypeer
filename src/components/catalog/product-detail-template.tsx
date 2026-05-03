import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { SpecTable } from "@/components/ui/spec-table";
import type { ProductDetailPageData } from "@/lib/types";
import { ProductImageGallery } from "./product-image-gallery";

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
    <div className="space-y-2">
      <nav aria-label="Breadcrumb" className="border border-line bg-white px-2.5 py-1.5">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] text-slate-600">
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
            <span className="font-medium text-slate-900">{data.title}</span>
          </li>
        </ol>
        <h1 className="mt-1 text-lg font-bold leading-snug text-slate-900">{data.title}</h1>
      </nav>

      {data.marketingBullets.length > 0 ? (
        <section className="border border-line bg-slate-50 px-2.5 py-2">
          <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-slate-800">
            {data.marketingBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-2 border border-line bg-white p-2.5 lg:grid-cols-[300px_1fr]">
        <ProductImageGallery images={data.images} productTitle={data.title} />

        <div className="grid gap-2 xl:grid-cols-[1fr_220px]">
          <div className="space-y-1 text-[11px]">
            <p className="text-slate-600">
              Brand: <span className="font-semibold text-slate-800">{data.brand}</span>
            </p>
            <p className="text-slate-600">
              Item #: <span className="font-semibold text-slate-800">{data.itemNumber}</span>
            </p>
            <p className="text-slate-600">
              SKU: <span className="font-semibold text-slate-800">{data.sku}</span>
            </p>
            <p className="text-slate-600">
              Mfr. Model: <span className="font-semibold text-slate-800">{data.manufacturerModel}</span>
            </p>
            <p className="mt-1 border-t border-line pt-1 text-slate-600">
              Availability:{" "}
              <span className="font-bold text-emerald-800">{data.availability}</span>
            </p>
            <p className="text-slate-600">
              Lead time: <span className="font-semibold text-slate-800">{data.leadTime}</span>
            </p>
            <p className="text-slate-600">
              Sell unit / pack: <span className="font-semibold text-slate-800">{data.packaging}</span>
            </p>
            {moqLabel ? (
              <p className="text-slate-600">
                MOQ:{" "}
                <span className="font-semibold text-slate-800">
                  {moqLabel} <span className="font-normal text-slate-500">{data.uom}</span>
                </span>
              </p>
            ) : null}
          </div>

          <aside className="border border-line bg-slate-50 p-2">
            <p className="text-[10px] text-slate-500">Web price</p>
            <p className="text-xl leading-none font-bold text-slate-900">
              {data.price}
              <span className="text-[10px] font-medium text-slate-600"> / {data.uom}</span>
            </p>
            <div className="mt-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Qty
              </p>
              <QuantitySelector value={1} />
            </div>
            <Button variant="primary" size="sm" className="mt-2 h-7 w-full text-[11px]">
              Add to Cart
            </Button>
            <Button variant="secondary" size="sm" className="mt-1 h-7 w-full text-[11px]">
              Request RFQ
            </Button>
          </aside>
        </div>
      </section>

      {data.shortDescription ? (
        <section className="border border-line bg-white px-2.5 py-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">Overview</h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-800">{data.shortDescription}</p>
        </section>
      ) : null}

      {data.features.length > 0 || data.applications.length > 0 ? (
        <section className="grid gap-2 md:grid-cols-2">
          {data.features.length > 0 ? (
            <article className="border border-line bg-white p-2.5">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
                Features
              </h2>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11px] text-slate-800">
                {data.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {data.applications.length > 0 ? (
            <article className="border border-line bg-white p-2.5">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
                Applications
              </h2>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11px] text-slate-800">
                {data.applications.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}

      <div className="border border-line bg-white p-2.5">
        <SpecTable
          title="Technical specifications"
          rows={data.specificationRows}
          emptyMessage="No extended specifications on file for this item. See overview and documents."
        />
      </div>

      {data.longDescription ? (
        <section className="border border-line bg-white p-2.5">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
            Description
          </h2>
          <div className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-800">
            {data.longDescription}
          </div>
        </section>
      ) : null}

      <section className="border border-line bg-white p-2.5">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
          Documents & resources
        </h2>
        {data.attachments.length === 0 ? (
          <p className="mt-1.5 text-[11px] text-slate-600">
            No downloadable documents listed. Request literature from buyer services.
          </p>
        ) : (
          <div className="mt-2 space-y-3">
            {Array.from(groupedDocs.entries())
              .sort(([a], [b]) => DOC_ORDER.indexOf(a) - DOC_ORDER.indexOf(b))
              .map(([docType, items]) => (
              <div key={docType}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {DOC_LABELS[docType] ?? DOC_LABELS.other}
                </h3>
                <ul className="mt-1 space-y-1">
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
                      <span className="ml-1 text-[10px] uppercase text-slate-500">
                        ({document.docType})
                      </span>
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
    <section className="border border-line bg-slate-50 p-2.5">
      <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
        {title}
      </h2>
      {products.length === 0 ? (
        <p className="text-[11px] text-slate-600">{empty}</p>
      ) : (
        <div className="grid gap-1.5 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="border border-line bg-white p-2">
              <Link
                href={product.slug ? `/product/${product.slug}` : "#"}
                className="text-[11px] font-semibold text-brand hover:underline"
              >
                {product.title}
              </Link>
              <p className="mt-0.5 text-[10px] text-slate-600">
                Item #: {product.itemNumber ?? product.sku}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {product.price}{" "}
                <span className="text-[10px] font-medium text-slate-600">/ {product.uom}</span>
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

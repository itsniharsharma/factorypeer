import Image from "next/image";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { SpecTable } from "@/components/ui/spec-table";
import { ProductDetailPageData } from "@/lib/types";

interface ProductDetailTemplateProps {
  data: ProductDetailPageData;
}

export function ProductDetailTemplate({ data }: ProductDetailTemplateProps) {
  return (
    <div className="space-y-2">
      <section className="border border-line bg-white px-2.5 py-1.5">
        <p className="text-[10px] text-slate-500">All Products / Electrical / Circuit Breakers</p>
        <h1 className="mt-0.5 text-lg font-bold text-slate-900">{data.title}</h1>
      </section>

      <section className="grid gap-2 border border-line bg-white p-2.5 lg:grid-cols-[280px_1fr]">
        <div className="space-y-1.5">
          <div className="relative h-48 overflow-hidden border border-line bg-slate-50">
            <Image src={data.images[0]} alt={data.title} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-5 gap-1">
            {data.images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative h-12 overflow-hidden border border-line bg-slate-50">
                <Image src={image} alt={`${data.title} ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2 xl:grid-cols-[1fr_240px]">
          <div className="space-y-0.5 text-[11px]">
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
              Availability: <span className="font-bold text-emerald-700">{data.availability}</span>
            </p>
            <p className="text-slate-600">
              Lead Time: <span className="font-semibold text-slate-800">{data.leadTime}</span>
            </p>
          </div>

          <aside className="border border-line bg-slate-50 p-2">
            <p className="text-[10px] text-slate-500">Web Price</p>
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

      <SpecTable title="Technical Specifications" rows={data.specificationRows} />

      <section className="grid gap-3 lg:grid-cols-2">
        <article className="border border-line bg-white p-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
            Product Description
          </h2>
          <p className="mt-2 text-xs text-slate-700">{data.description}</p>
        </article>

        <article className="border border-line bg-white p-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
            Documents and Datasheets
          </h2>
          <ul className="mt-2 space-y-1.5">
            {data.documents.map((document) => (
              <li key={document.id}>
                <a href="#" className="text-xs font-semibold text-brand hover:underline">
                  {document.name} ({document.type})
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="border border-line bg-white p-3">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-700">
          Related Products
        </h2>
        <div className="grid gap-2 md:grid-cols-3">
          {data.relatedProducts.map((product) => (
            <article key={product.id} className="border border-line bg-slate-50 p-2">
              <p className="text-xs font-semibold text-slate-900">{product.title}</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Item #: {product.itemNumber ?? product.sku}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {product.price} / {product.uom}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-line bg-white p-3">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-700">
          Frequently Bought Together / Accessories
        </h2>
        <div className="grid gap-2 md:grid-cols-2">
          {data.accessories.map((product) => (
            <article key={product.id} className="border border-line bg-slate-50 p-2">
              <p className="text-xs font-semibold text-slate-900">{product.title}</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Item #: {product.itemNumber ?? product.sku}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {product.price} / {product.uom}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

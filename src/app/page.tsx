import { AppShell } from "@/components/layout/app-shell";
import {
  CategoryTileGrid,
  FeaturedProductsRow,
  PromoBannerRow,
  SupportCardsRow,
} from "@/components/home";
import { getFeaturedHomeProducts, getHomepagePromoBanners, getHomepageCategoryTiles, getHomepageSupportCards } from "@/lib/catalog-service";

export const revalidate = 60;

export default async function Home() {
  const featuredProducts = await getFeaturedHomeProducts(6).catch(() => []);
  const homepagePromoBanners = await getHomepagePromoBanners().catch(() => []);
  const homepageCategoryTiles = await getHomepageCategoryTiles().catch(() => []);
  const homepageSupportCards = await getHomepageSupportCards().catch(() => []);

  return (
    <AppShell>
      <section className="space-y-3">
        {homepagePromoBanners.length === 0 ? (
          <div className="rounded-sm border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-600">
            No published homepage promo banners yet.
          </div>
        ) : (
          <PromoBannerRow banners={homepagePromoBanners} />
        )}
        {featuredProducts.length === 0 ? (
          <div className="rounded-sm border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-600">
            No published products yet. Publish products in admin — they will appear here automatically.
          </div>
        ) : (
          <FeaturedProductsRow products={featuredProducts} />
        )}
        {homepageCategoryTiles.length === 0 ? (
          <div className="rounded-sm border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-600">
            No published homepage category tiles yet.
          </div>
        ) : (
          <CategoryTileGrid tiles={homepageCategoryTiles} />
        )}
        {homepageSupportCards.length === 0 ? (
          <div className="rounded-sm border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-600">
            No published homepage support cards yet.
          </div>
        ) : (
          <SupportCardsRow cards={homepageSupportCards} />
        )}
      </section>
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import {
  CategoryTileGrid,
  PromoBannerRow,
  RecentlyViewedProductsSection,
  SupportCardsRow,
} from "@/components/home";
import {
  getHomepageBrowseCategoryTiles,
  getHomepagePromoBanners,
  getHomepageSupportCards,
} from "@/lib/catalog-service";

export const revalidate = 60;

export default async function Home() {
  const homepagePromoBanners = await getHomepagePromoBanners().catch(() => []);
  const homepageCategoryTiles = await getHomepageBrowseCategoryTiles(14).catch(() => []);
  const homepageSupportCards = await getHomepageSupportCards().catch(() => []);

  return (
    <AppShell>
      <section className="space-y-3">
        {homepagePromoBanners.length > 0 ? <PromoBannerRow banners={homepagePromoBanners} /> : null}
        <RecentlyViewedProductsSection />
        {homepageCategoryTiles.length > 0 ? <CategoryTileGrid tiles={homepageCategoryTiles} /> : null}
        {homepageSupportCards.length > 0 ? <SupportCardsRow cards={homepageSupportCards} /> : null}
      </section>
    </AppShell>
  );
}

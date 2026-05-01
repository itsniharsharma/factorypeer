import { AppShell } from "@/components/layout/app-shell";
import {
  CategoryTileGrid,
  FeaturedProductsRow,
  PromoBannerRow,
  SupportCardsRow,
} from "@/components/home";
import {
  homepageCategoryTiles,
  homepageFeaturedProducts,
  homepagePromoBanners,
  homepageSupportCards,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <AppShell>
      <section className="space-y-3">
        <PromoBannerRow banners={homepagePromoBanners} />
        <FeaturedProductsRow products={homepageFeaturedProducts} />
        <CategoryTileGrid tiles={homepageCategoryTiles} />
        <SupportCardsRow cards={homepageSupportCards} />
      </section>
    </AppShell>
  );
}

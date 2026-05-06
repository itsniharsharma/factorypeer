import type { z } from "zod";
import type { CatalogAdminServices } from "../composition-root.js";
import {
  footerCmsSeed,
  getHomepageCategoryTileSeeds,
  getHomepagePromoBannerSeeds,
  homepageSupportCardSeeds,
  megaMenuUtilityLinkGroupSeed,
  utilityLinkGroupSeed,
} from "./merchandising-seed-data.js";
import { createHomepageBannerBodySchema, createHomepageTileBodySchema } from "../validation/homepage-content.js";

async function seedCollectionIfEmpty<T>(items: T[], seed: () => Promise<unknown>) {
  if (items.length === 0) {
    await seed();
  }
}

function toMutableLinkGroup<T extends { links?: readonly Record<string, unknown>[] }>(item: T) {
  return {
    ...item,
    links: item.links?.map((link) => ({ ...link })) ?? [],
  };
}

export async function seedMerchandisingContent(services: Pick<CatalogAdminServices, "homepage" | "navigation">) {
  await seedCollectionIfEmpty(await services.homepage.listBanners(), async () => {
    await Promise.all(
      getHomepagePromoBannerSeeds().map((item) =>
        services.homepage.createBanner(item as z.infer<typeof createHomepageBannerBodySchema>),
      ),
    );
  });

  await seedCollectionIfEmpty(await services.homepage.listCategoryTiles(), async () => {
    await Promise.all(
      getHomepageCategoryTileSeeds().map((item) =>
        services.homepage.createCategoryTile(item as z.infer<typeof createHomepageTileBodySchema>),
      ),
    );
  });

  await seedCollectionIfEmpty(await services.homepage.listSupportCards(), async () => {
    await Promise.all(homepageSupportCardSeeds.map((item) => services.homepage.createSupportCard(item)));
  });

  await seedCollectionIfEmpty(await services.navigation.listLinkGroups(undefined, "utility"), async () => {
    await services.navigation.createLinkGroup(toMutableLinkGroup(utilityLinkGroupSeed));
  });

  await seedCollectionIfEmpty(await services.navigation.listLinkGroups(undefined, "navigation"), async () => {
    await services.navigation.createLinkGroup(toMutableLinkGroup(megaMenuUtilityLinkGroupSeed));
  });

  const seedFooterPayload = {
    ...footerCmsSeed,
    status: "published" as const,
    columns: footerCmsSeed.columns.map((c) => ({
      ...c,
      links: c.links.map((l) => ({ ...l })),
    })),
    socialLinks: footerCmsSeed.socialLinks.map((s) => ({ ...s })),
    legalLinks: footerCmsSeed.legalLinks.map((l) => ({ ...l })),
    newsletter: { ...footerCmsSeed.newsletter },
    appDownloads: {
      ...footerCmsSeed.appDownloads,
      appStore: { ...footerCmsSeed.appDownloads.appStore },
      googlePlay: { ...footerCmsSeed.appDownloads.googlePlay },
    },
    connect: { ...footerCmsSeed.connect },
  };

  await seedCollectionIfEmpty(await services.navigation.listFooterContents(), async () => {
    await services.navigation.createFooterContent(seedFooterPayload);
  });
}

export default seedMerchandisingContent;
import { footerContentSeed, footerLinkGroupSeeds, homepageCategoryTileSeeds, homepagePromoBannerSeeds, homepageSupportCardSeeds, megaMenuUtilityLinkGroupSeed, utilityLinkGroupSeed, } from "./merchandising-seed-data.js";
async function seedCollectionIfEmpty(items, seed) {
    if (items.length === 0) {
        await seed();
    }
}
function toMutableLinkGroup(item) {
    return {
        ...item,
        links: item.links?.map((link) => ({ ...link })) ?? [],
    };
}
function toMutableFooterContent(item) {
    return {
        ...item,
        socialLinks: item.socialLinks?.map((link) => ({ ...link })) ?? [],
    };
}
export async function seedMerchandisingContent(services) {
    await seedCollectionIfEmpty(await services.homepage.listBanners(), async () => {
        await Promise.all(homepagePromoBannerSeeds.map((item) => services.homepage.createBanner(item)));
    });
    await seedCollectionIfEmpty(await services.homepage.listCategoryTiles(), async () => {
        await Promise.all(homepageCategoryTileSeeds.map((item) => services.homepage.createCategoryTile(item)));
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
    await seedCollectionIfEmpty(await services.navigation.listLinkGroups(undefined, "footer"), async () => {
        await Promise.all(footerLinkGroupSeeds.map((item) => services.navigation.createLinkGroup(toMutableLinkGroup(item))));
    });
    await seedCollectionIfEmpty(await services.navigation.listFooterContents(), async () => {
        await services.navigation.createFooterContent(toMutableFooterContent(footerContentSeed));
    });
}
export default seedMerchandisingContent;

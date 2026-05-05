import { NextResponse } from "next/server";
import type { MegaMenuRootGroup } from "@/lib/types";
import { getMegaMenuNavigation, getMegaMenuUtilityLinks } from "@/lib/catalog-service";

type MegaMenuNavigation = {
  groups: MegaMenuRootGroup[];
};

export async function GET() {
  try {
    const [nav, utilityLinks] = await Promise.all([
      getMegaMenuNavigation(),
      getMegaMenuUtilityLinks(),
    ]);
    const megaMenu = nav as MegaMenuNavigation;
    return NextResponse.json({
      groups: megaMenu.groups,
      utilityLinks: utilityLinks.map((link) => ({
        label: link.label,
        href: link.href,
      })),
    });
  } catch (err) {
    // Propagate error status so client-side can treat this as a fetch failure
    const message = err instanceof Error ? err.message : "catalog upstream error";
    return NextResponse.json({ error: true, message, groups: [], utilityLinks: [] }, { status: 503 });
  }
}

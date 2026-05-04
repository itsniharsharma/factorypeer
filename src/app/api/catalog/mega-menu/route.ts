import { NextResponse } from "next/server";
import { getMegaMenuNavigation, getMegaMenuUtilityLinks } from "@/lib/catalog-service";

export async function GET() {
  try {
    const [nav, utilityLinks] = await Promise.all([
      getMegaMenuNavigation(),
      getMegaMenuUtilityLinks(),
    ]);
    return NextResponse.json({
      groups: nav.groups,
      previewLinks: nav.previewLinks,
      utilityLinks: utilityLinks.map((link) => ({
        label: link.label,
        href: link.href,
      })),
    });
  } catch {
    return NextResponse.json({ groups: [], previewLinks: [], utilityLinks: [] });
  }
}

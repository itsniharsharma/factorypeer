import { NextResponse } from "next/server";
import { getMegaMenuNavigation, getMegaMenuUtilityLinks } from "@/lib/catalog-service";

export async function GET() {
  try {
    const [nav, utilityLinks] = await Promise.all([
      getMegaMenuNavigation(),
      getMegaMenuUtilityLinks(),
    ]);
    return NextResponse.json({
      ...nav,
      utilityLinks: utilityLinks.map((link) => ({
        label: link.label,
        href: link.href,
      })),
    });
  } catch {
    return NextResponse.json({ columns: [], previewLinks: [], utilityLinks: [] });
  }
}

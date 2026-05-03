import { NextRequest, NextResponse } from "next/server";
import { getExactCatalogSearchMatch } from "@/lib/catalog-service";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  try {
    const match = await getExactCatalogSearchMatch(q);
    return NextResponse.json(match ?? null);
  } catch {
    return NextResponse.json(null);
  }
}

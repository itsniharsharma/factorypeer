import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/catalog-service";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("ids") ?? "";
  const ids = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 24);

  if (!ids.length) return NextResponse.json([]);

  try {
    const products = await getProductsByIds(ids);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}


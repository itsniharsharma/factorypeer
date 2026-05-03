import { NextRequest, NextResponse } from "next/server";
import { getSearchAutocomplete } from "@/lib/catalog-service";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  try {
    const suggestions = await getSearchAutocomplete(q, 10);
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}

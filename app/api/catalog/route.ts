import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const items = searchCatalog(q, category || undefined).slice(0, 24);
  return NextResponse.json({ items });
}

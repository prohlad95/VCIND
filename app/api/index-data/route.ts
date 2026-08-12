import { NextResponse } from "next/server";
import { getIndexData } from "@/lib/index-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getIndexData();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch market data. Yahoo Finance's endpoint may be rate-limiting or unavailable." },
      { status: 502 }
    );
  }
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET() {
  try {
    console.log(`Fetching flags from: ${API_URL}/flags`);
    const res = await fetch(`${API_URL}/flags`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
    const data = await res.json();
    console.log(`Successfully fetched ${data.data?.length || 0} flags`);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Flag fetch error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

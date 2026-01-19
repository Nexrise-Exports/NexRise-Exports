import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch categories from backend");
      return NextResponse.json([]);
    }

    const data = await response.json();

    if (data.success && data.data) {
      return NextResponse.json(data.data);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json([], { status: 500 });
  }
}

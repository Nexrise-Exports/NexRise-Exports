import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    const response = await fetch(`${API_BASE_URL}/documentation?status=${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch documentation");
    }

    const data = await response.json();

    // Transform backend data to frontend format
    const documentation = (data.data?.documentation || []).map((doc: any) => ({
      _id: doc._id,
      title: doc.title,
      image: doc.image,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json(documentation);
  } catch (error: any) {
    console.error("Error fetching documentation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documentation" },
      { status: 500 }
    );
  }
}


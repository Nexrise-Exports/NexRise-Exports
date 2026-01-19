import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "active";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "9";

    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (status) queryParams.append("status", status);
    if (category && category !== "all") {
      queryParams.append("category", category);
    }

    // Fetch products from backend
    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch products from backend");
      return NextResponse.json({ products: [], pagination: { totalItems: 0, totalPages: 0 } });
    }

    const data = await response.json();

    // Transform backend product format to frontend format
    if (data.success && data.data?.products) {
      const transformedProducts = data.data.products.map((product: any, index: number) => ({
        id: product._id || index + 1,
        name: product.propertyTitle || "Product",
        description: product.description || "",
        region: product.origin || "India",
        tasteProfile: product.keyCharacteristics || product.usage || "",
        imageUrl: product.displayPhoto || "",
        tags: product.category ? [product.category.charAt(0).toUpperCase() + product.category.slice(1)] : [],
        story: product.biologicalBackground || "",
        category: product.category || "whole",
        subcategory: product.subcategory || null,
      }));

      return NextResponse.json({
        products: transformedProducts,
        pagination: data.data.pagination
      });
    }

    return NextResponse.json({ products: [], pagination: { totalItems: 0, totalPages: 0 } });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ products: [], pagination: { totalItems: 0, totalPages: 0 } }, { status: 500 });
  }
}


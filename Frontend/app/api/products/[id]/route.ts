import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Fetch product from backend
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const data = await response.json();

    if (data.success && data.data?.product) {
      const product = data.data.product;
      return NextResponse.json({
        id: product._id,
        name: product.propertyTitle,
        description: product.description,
        origin: product.origin,
        biologicalBackground: product.biologicalBackground,
        usage: product.usage,
        keyCharacteristics: product.keyCharacteristics,
        displayPhoto: product.displayPhoto,
        additionalPhotos: product.additionalPhotos || [],
        category: product.category,
        status: product.status,
      });
    }

    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}


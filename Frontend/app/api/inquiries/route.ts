import { NextResponse } from "next/server";
import { insertInquirySchema } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = insertInquirySchema.parse(body);
    
    // Save to backend database
    const response = await fetch(`${API_BASE_URL}/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to submit enquiry" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { message: error.message || "Validation failed" },
      { status: 400 }
    );
  }
}


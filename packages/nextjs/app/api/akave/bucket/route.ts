import { NextResponse } from "next/server";

const AKAVE_BACKEND_URL = process.env.AKAVE_BACKEND_URL;

if (!AKAVE_BACKEND_URL) {
  throw new Error("AKAVE_BACKEND_URL environment variable is not set");
}

// List all buckets
export async function GET() {
  try {
    const response = await fetch(`${AKAVE_BACKEND_URL}/buckets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch buckets" },
      { status: 500 }
    );
  }
}

// Create a new bucket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bucketName } = body;

    if (!bucketName) {
      return NextResponse.json(
        { success: false, error: "Bucket name is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${AKAVE_BACKEND_URL}/buckets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketName }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating bucket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create bucket" },
      { status: 500 }
    );
  }
}

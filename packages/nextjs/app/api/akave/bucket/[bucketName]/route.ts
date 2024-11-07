import { NextResponse } from "next/server";

const AKAVE_BACKEND_URL = process.env.AKAVE_BACKEND_URL;

// Get specific bucket details
export async function GET(
  request: Request,
  { params }: { params: { bucketName: string } }
) {
  try {
    const { bucketName } = params;
    const response = await fetch(`${AKAVE_BACKEND_URL}/buckets/${bucketName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bucket details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bucket details" },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";

const AKAVE_BACKEND_URL = process.env.AKAVE_BACKEND_URL;

// List files in a bucket
export async function GET(
  request: Request,
  { params }: { params: { bucketName: string } }
) {
  try {
    const { bucketName } = params;
    const response = await fetch(`${AKAVE_BACKEND_URL}/buckets/${bucketName}/files`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list files" },
      { status: 500 }
    );
  }
}

// Upload file to bucket
export async function POST(
  request: Request,
  { params }: { params: { bucketName: string } }
) {
  try {
    const { bucketName } = params;
    const formData = await request.formData();
    
    const response = await fetch(`${AKAVE_BACKEND_URL}/buckets/${bucketName}/files`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 
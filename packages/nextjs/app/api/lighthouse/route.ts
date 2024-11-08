import { NextRequest, NextResponse } from "next/server";
import { uploadToLighthouseDataDepot } from "./data-depot";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;
    const apiKey = form.get("apiKey") as string;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadToLighthouseDataDepot(file, apiKey);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

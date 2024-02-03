import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export interface UploadImageParams {
  name: string;
  type: string;
}

async function compressImage(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.from(arrayBuffer);
  return sharp(buffer).webp().toBuffer();
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json({
      error: "File is required",
      status: 400,
    });
  }

  try {
    const compressedImage = await compressImage(await file.arrayBuffer());
    const fileName = uuidv4() + "." + "webp";

    return NextResponse.json({ success: true, compressedImage, fileName });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

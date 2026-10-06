"use server";

import { createClient } from "@spiel-wedding/database/server";
import { Photo } from "@spiel-wedding/types/Photo";
import sharp from "sharp";

function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

interface PlaceholderOptions {
  imagePath: string;
  bucket: string;
  mimeType?: string;
}

export async function generatePlaceholder(options: PlaceholderOptions) {
  if (options.mimeType?.includes("video")) {
    return undefined;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(options.bucket)
    .download(options.imagePath);

  if (!data || error) {
    console.log(`Error while retrieving placeholder: ${error}`);
    return undefined;
  }

  try {
    const buffer = Buffer.from(await data.arrayBuffer());
    const resizedBuffer = await sharp(buffer).resize(48).toFormat("png").toBuffer();

    return bufferToBase64(resizedBuffer);
  } catch (err) {
    console.error("Error while generating placeholder:", err);
    return undefined;
  }
}

export async function getPlaceholderImage(photo: Photo): Promise<Photo> {
  const blurDataUrl = await generatePlaceholder({
    imagePath: photo.imagePath,
    bucket: "gallery",
  });

  return blurDataUrl ? { ...photo, blurDataUrl } : photo;
}

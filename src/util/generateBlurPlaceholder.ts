"use server";

import { createClient } from "@spiel-wedding/database/client";
import { Photo } from "@spiel-wedding/types/Photo";
import sharp from "sharp";

function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

interface PlaceholderOptions {
  imagePath: string;
  bucket: string;
  mimeType: string;
}

export async function generatePlaceholder(options: PlaceholderOptions) {
  if (options.mimeType.includes("video")) {
    return undefined;
  }

  const supabase = createClient();
  const { data } = supabase.storage.from(options.bucket).getPublicUrl(options.imagePath, {
    transform: {
      quality: 50,
      width: 48,
      height: 48,
    },
  });

  const buffer = await fetch(data.publicUrl).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const resizedBuffer = await sharp(buffer).resize(20).toBuffer();
  return bufferToBase64(resizedBuffer);
}

export async function getPlaceholderImage(photo: Photo): Promise<Photo> {
  const supabase = createClient();

  const { data } = supabase.storage.from("gallery").getPublicUrl(photo.imagePath, {
    transform: {
      quality: 50,
      width: 48,
      height: 48,
    },
  });

  const buffer = await fetch(data.publicUrl).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const resizedBuffer = await sharp(buffer).resize(20).toBuffer();
  return { ...photo, blurDataUrl: bufferToBase64(resizedBuffer) };
}

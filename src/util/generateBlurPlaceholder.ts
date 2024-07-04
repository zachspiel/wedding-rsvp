"use server";
import { createClient } from "@spiel-wedding/database/server";
import { Photo } from "@spiel-wedding/types/Photo";
import sharp from "sharp";

function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
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

import { createClient } from "@spiel-wedding/database/server";
import { Photo } from "@spiel-wedding/types/Photo";
import { getPlaiceholder } from "plaiceholder";

const cache = new Map<Photo, string>();

export default async function getBase64ImageUrl(photo: Photo): Promise<Photo> {
  const supabase = createClient();
  const { data: imageUrl } = supabase.storage
    .from("gallery")
    .getPublicUrl(photo.imagePath);

  let url = cache.get(photo);
  if (url) {
    return { ...photo, blurDataUrl: url };
  }

  const buffer = await fetch(imageUrl.publicUrl).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const { base64 } = await getPlaiceholder(buffer);

  cache.set(photo, base64);

  return { ...photo, blurDataUrl: base64 };
}

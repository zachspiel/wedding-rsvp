import { createClient } from "@spiel-wedding/database/client";
import { GuestImageWithLikes, GuestUploadedImage } from "@spiel-wedding/types/Photo";

const GUEST_IMAGES_TABLE = "guest_uploaded_images";
const GUEST_IMAGE_LIKES_TABLE = "guest_image_likes";

export const getGuestImages = async (): Promise<GuestImageWithLikes[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from(GUEST_IMAGES_TABLE)
    .select("*, guest_image_likes(*)");

  return data ?? [];
};

export const saveGuestUploadedImages = async (
  guestUploadedImage: Omit<GuestUploadedImage, "file_id">[]
): Promise<GuestUploadedImage[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from(GUEST_IMAGES_TABLE)
    .insert(guestUploadedImage)
    .select()
    .returns<GuestUploadedImage[]>();

  return data ?? [];
};

export const getGuestImageLikes = async (fileId: string): Promise<number> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(GUEST_IMAGE_LIKES_TABLE)
    .select()
    .eq("file_id", fileId);

  if (error) {
    return 0;
  }

  return (data ?? []).length;
};

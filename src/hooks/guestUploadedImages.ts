import { createClient } from "@spiel-wedding/database/client";
import { GuestUploadedImage, UploadImageFormData } from "@spiel-wedding/types/Photo";

const GUEST_IMAGES_TABLE = "guest_uploaded_images";

export const getGuestImages = async (): Promise<GuestUploadedImage[]> => {
  const supabase = createClient();
  const { data } = await supabase.from(GUEST_IMAGES_TABLE).select("*");

  return data ?? [];
};

export const saveGuestUploadedImages = async (
  guestUploadedImage: UploadImageFormData[]
): Promise<GuestUploadedImage[]> => {
  console.log(guestUploadedImage);

  const supabase = createClient();
  const { data } = await supabase
    .from(GUEST_IMAGES_TABLE)
    .insert(guestUploadedImage)
    .select()
    .returns<GuestUploadedImage[]>();

  return data ?? [];
};

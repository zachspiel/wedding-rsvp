import { createClient } from "@spiel-wedding/database/client";
import {
  GuestImageComment,
  GuestUploadedImage,
  UploadImageFormData,
} from "@spiel-wedding/types/Photo";

const GUEST_IMAGES_TABLE = "guest_uploaded_images";
const GUEST_IMAGE_COMMENTS_TABLE = "guest_image_comments";

export const getGuestImages = async (): Promise<GuestUploadedImage[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(GUEST_IMAGES_TABLE)
    .select("*, guest_image_comments(comment_id)")
    .order("created_at", { ascending: false });

  if (data === null || error) {
    return [];
  }

  return data ?? [];
};

export const saveGuestUploadedImages = async (
  guestUploadedImage: UploadImageFormData[]
): Promise<GuestUploadedImage[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from(GUEST_IMAGES_TABLE)
    .insert(guestUploadedImage)
    .select()
    .returns<GuestUploadedImage[]>();

  return data ?? [];
};

export const getCommentsForImage = async (
  fileId: string
): Promise<GuestImageComment[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from(GUEST_IMAGE_COMMENTS_TABLE)
    .select("*")
    .eq("file_id", fileId)
    .order("created_at", { ascending: false });

  return data ?? [];
};

export const addCommentToImage = async (
  fileId: string,
  message: string,
  firstName: string,
  lastName: string
): Promise<GuestImageComment[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from(GUEST_IMAGE_COMMENTS_TABLE)
    .insert({
      first_name: firstName,
      last_name: lastName,
      file_id: fileId,
      message,
    })
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
};

import { Photo } from "@spiel-wedding/types/Photo";
import { v4 as uuid } from "uuid";
import { FileObject } from "@supabase/storage-js";
import { createClient } from "@spiel-wedding/database/client";

export const GALLERY_SWR_KEY = "gallery";

const supabase = createClient();
const TABLE = "gallery";

export const getPhotoGallery = async (): Promise<Photo[]> => {
  const { data } = await supabase.from(TABLE).select();

  return data ?? [];
};

export const updatePhoto = async (
  id: string,
  photo: Partial<Photo>
): Promise<Photo | null> => {
  const { data } = await supabase
    .from(TABLE)
    .update({ ...photo })
    .eq("gallery_id", id)
    .select();

  return data?.[0];
};

export const uploadFileToGallery = async (file: File): Promise<Photo | null> => {
  const fileExtension = file.name.split(".").pop();
  const fileName = uuid() + "." + fileExtension;

  const { data } = await supabase.storage.from(TABLE).upload(fileName, file);

  if (data?.path) {
    return await addImageCaption(data.path);
  }

  return null;
};

export const addImageCaption = async (imagePath: string): Promise<Photo | null> => {
  const newImage: Omit<Photo, "gallery_id"> = {
    caption: "",
    isVisible: false,
    imagePath: imagePath,
  };

  const { data, error } = await supabase.from(TABLE).insert(newImage).select();

  if (error) {
    return null;
  }

  return data?.[0];
};

export const removeImage = async (photo: Photo): Promise<FileObject[] | null> => {
  const { data } = await supabase.storage.from("gallery").remove([photo.imagePath]);

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("gallery_id", photo.gallery_id);

  if (error) {
    return null;
  }

  return data;
};

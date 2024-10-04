import { createClient } from "@spiel-wedding/database/client";
import { GuestImageWithLikes, GuestUploadedImage } from "@spiel-wedding/types/Photo";
import * as tus from "tus-js-client";

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

export const uploadFileToGuestGallery = async (
  file: File,
  id: string,
  onUploadProgress: (progress: number) => void
): Promise<string | null> => {
  const BEARER_TOKEN = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return new Promise((resolve, reject) => {
    var upload = new tus.Upload(file, {
      endpoint: `https://qaobgjglyovmcaiiagyx.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${BEARER_TOKEN}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: "guest_gallery",
        objectName: id,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError: function (error) {
        console.log("Failed because: " + error);
        reject(error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);

        onUploadProgress(parseInt(percentage));
      },
      onSuccess: function () {
        console.log("Download %s from %s", file.name, upload.url);
        resolve(file.name);
      },
    });

    return upload.findPreviousUploads().then(function (previousUploads) {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      upload.start();
    });
  });
};

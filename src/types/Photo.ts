export interface Photo {
  gallery_id: string;
  caption?: string;
  isVisible: boolean;
  imagePath: string;
  blurDataUrl?: string;
}

export interface GuestPhotoUploadResult {
  docId?: string | null;
  success: boolean;
}

export interface UploadedPhotoGallery {
  files: {
    id?: string | null;
    name?: string | null;
  }[];
}

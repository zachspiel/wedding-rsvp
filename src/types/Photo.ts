export interface Photo {
  gallery_id: string;
  caption?: string;
  isVisible: boolean;
  imagePath: string;
  blurDataUrl?: string;
}

/**
 * Data returned from Google Drive API
 */
export interface UploadedPhotoGallery {
  files: GoogleDriveFile[];
}

export interface GoogleDriveFile {
  id?: string | null;
  name?: string | null;
  mimeType?: string | null;
}

export interface GuestUploadedImage {
  file_id: string;
  first_name: string;
  last_name: string;
  file_name: string;
  mime_type: string;
  downloads: number;
  likes: number;
  created_at: string | null;
  guest_image_comments?: GuestImageComment[];
}

export interface UploadImageFormData {
  first_name: string;
  last_name: string;
  file_name: string;
  mime_type: string;
}

export interface GuestImageComment {
  comment_id: string;
  file_id: string;
  first_name: string;
  last_name: string;
  message: string;
  likes: number;
  created_at: string;
}

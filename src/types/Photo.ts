export interface Photo {
  gallery_id: string;
  caption?: string;
  isVisible: boolean;
  imagePath: string;
  blurDataUrl?: string;
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
  image_tag?: string | null;
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

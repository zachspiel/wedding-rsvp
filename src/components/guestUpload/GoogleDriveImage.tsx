import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import Image from "next/image";

interface Props {
  id: string;
  mimeType: string;
  guestUploadedImages: GuestUploadedImage[];
}

const GoogleDriveImage = ({ id, mimeType }: Props) => {
  if (mimeType.includes("video")) {
    return (
      <iframe
        allowFullScreen
        src={`https://drive.google.com/file/d/${id}/preview`}
        style={{ flexGrow: 1, border: 0, margin: 0, padding: 0 }}
      />
    );
  }

  return (
    <Image
      src={`https://drive.google.com/uc?export=view&id=${id}`}
      fill
      style={{
        objectFit: "fill",
        objectPosition: "top",
        transform: "translate3d(0, 0, 0)",
      }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
      alt={id}
    />
  );
};

export default GoogleDriveImage;

import Image from "next/image";

interface Props {
  id: string;
}
const GoogleDriveImage = ({ id }: Props) => {
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
      alt="test"
    />
  );
};

export default GoogleDriveImage;

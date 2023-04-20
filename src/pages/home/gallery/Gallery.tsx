import React from "react";
import { Carousel } from "@mantine/carousel";
import { onValue, ref } from "firebase/database";
import { database } from "../../../database/database";
import GalleryImage from "./GalleryImage";
import UploadImages from "./UploadImages";
import useAdminView from "../../../hooks/adminView";
import SectionTitle from "../../../components/common/SectionTitle";
import { Photo } from "../../../types/Photo";

export interface Captions {
  [key: string]: string;
}

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const [photos, setPhotos] = React.useState<Photo[]>([]);

  React.useEffect(() => {
    onValue(ref(database, "photos"), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setPhotos(Object.values(data));
      }
    });
  }, []);

  const availableImages = isAdminViewEnabled
    ? photos
    : photos.filter((image) => image.isVisible);

  const slides = availableImages.map((item) => (
    <Carousel.Slide key={item.id}>
      <GalleryImage image={item} displayAdminView={isAdminViewEnabled} />
    </Carousel.Slide>
  ));

  return (
    <>
      <SectionTitle title="Gallery" id="gallery" />
      {isAdminViewEnabled && <UploadImages />}

      <Carousel
        slideSize="50%"
        breakpoints={[{ maxWidth: "sm", slideSize: "100%", slideGap: 1 }]}
        slideGap="xl"
        pb="xl"
        align="start"
        withIndicators
        slidesToScroll={1}
      >
        {slides}
      </Carousel>
    </>
  );
};

export default Gallery;

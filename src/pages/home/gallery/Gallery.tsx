import React from "react";
import { Carousel } from "@mantine/carousel";
import { onValue, ref } from "firebase/database";
import { database } from "../../../database/database";
import GalleryImage from "./GalleryImage";
import UploadImages from "./UploadImages";
import useAdminView from "../../../hooks/adminView";
import SectionTitle from "../../../components/common/SectionTitle";
import { Photo } from "../../../types/Photo";
import { Container, SimpleGrid } from "@mantine/core";

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
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
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
            nextControlLabel="Next gallery image"
            previousControlLabel="Previous gallery image"
          >
            {slides}
          </Carousel>
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default Gallery;

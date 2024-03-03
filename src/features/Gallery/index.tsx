"use client";

import { Carousel } from "@mantine/carousel";
import GalleryImage from "./components/GalleryImage";
import UploadImages from "./components/UploadImages";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import { getPhotoGallery, GALLERY_SWR_KEY } from "@spiel-wedding/hooks/gallery";
import useSWR from "swr";
import classes from "./gallery.module.css";

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const { data: photos } = useSWR(GALLERY_SWR_KEY, getPhotoGallery);

  const slides = photos
    ?.filter((photo) => (isAdminViewEnabled ? true : photo.isVisible))
    .map((photo) => (
      <Carousel.Slide key={photo.id}>
        <GalleryImage image={photo} displayAdminView={isAdminViewEnabled} />
      </Carousel.Slide>
    ));

  return (
    <SectionContainer grayBackground flowerImages>
      <SectionTitle title="Gallery" id="gallery" hideFlowers />
      {isAdminViewEnabled && <UploadImages />}

      <Carousel slideSize="70%" slideGap="md" loop withIndicators classNames={classes}>
        {slides}
      </Carousel>
    </SectionContainer>
  );
};

export default Gallery;

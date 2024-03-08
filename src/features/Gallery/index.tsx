"use client";

import { Carousel } from "@mantine/carousel";
import GalleryImage from "./components/GalleryImage";
import UploadImages from "./components/UploadImages";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import { getPhotoGallery, GALLERY_SWR_KEY } from "@spiel-wedding/hooks/gallery";
import useSWR from "swr";
import classes from "./gallery.module.css";
import { v4 as uuid } from "uuid";
import { Paper, Skeleton } from "@mantine/core";

const LOADING_SCREEN = [uuid(), uuid(), uuid()];

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const { data: photos, isLoading } = useSWR(GALLERY_SWR_KEY, getPhotoGallery);

  const slides = photos
    ?.filter((photo) => (isAdminViewEnabled ? true : photo.isVisible))
    .map((photo) => (
      <Carousel.Slide key={photo.id}>
        <GalleryImage image={photo} displayAdminView={isAdminViewEnabled} />
      </Carousel.Slide>
    ));

  const loadingScreen = () => {
    return LOADING_SCREEN.map((item) => {
      return (
        <Carousel.Slide key={item}>
          <Paper bg="none" radius="md" className={classes.card}>
            <Skeleton height="100%" w="100%" />
          </Paper>
        </Carousel.Slide>
      );
    });
  };

  return (
    <SectionContainer
      id="gallery"
      greenBackground
      flowerImages={(photos ?? []).length > 0}
    >
      <SectionTitle title="Gallery" hideFlowers={(photos ?? []).length > 0} />
      {isAdminViewEnabled && <UploadImages />}

      <Carousel
        slideSize={{ base: "100%", sm: "50%" }}
        slideGap="md"
        loop
        withIndicators
        classNames={classes}
      >
        {slides}
        {isLoading && loadingScreen()}
      </Carousel>
    </SectionContainer>
  );
};

export default Gallery;

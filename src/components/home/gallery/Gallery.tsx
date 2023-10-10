"use client";

import { Carousel } from "@mantine/carousel";
import { onValue, ref } from "firebase/database";
import { database } from "@spiel-wedding/database/database";
import GalleryImage from "./GalleryImage";
import UploadImages from "./UploadImages";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { Photo } from "@spiel-wedding/types/Photo";
import { useState, useEffect } from "react";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import classes from "./gallery.module.css";
import { rem } from "@mantine/core";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";

export interface Captions {
  [key: string]: string;
}

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
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
    <SectionContainer grayBackground>
      <SectionTitle title="Gallery" id="gallery" />
      {isAdminViewEnabled && <UploadImages />}

      <Carousel
        slideSize={{ md: "50%", sm: "100%", xs: "100%" }}
        slideGap={{ sm: "md" }}
        slidesToScroll={1}
        loop
        withIndicators
        classNames={classes}
      >
        {slides}
      </Carousel>
    </SectionContainer>
  );
};

export default Gallery;

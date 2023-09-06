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
import { createStyles, getStylesRef } from "@mantine/core";
import GalleryOrderForm from "./GalleryOrderForm";

export interface Captions {
  [key: string]: string;
}

const useStyles = createStyles(() => ({
  controls: {
    ref: getStylesRef("controls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  root: {
    "&:hover": {
      [`& .${getStylesRef("controls")}`]: {
        opacity: 1,
      },
    },
  },
}));

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { classes } = useStyles();

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
        slideSize="50%"
        breakpoints={[{ maxWidth: "sm", slideSize: "100%", slideGap: 1 }]}
        slideGap="xl"
        pb="xl"
        align="start"
        slidesToScroll={1}
        loop
        nextControlLabel="Next gallery image"
        previousControlLabel="Previous gallery image"
        classNames={classes}
      >
        {slides}
      </Carousel>

      {isAdminViewEnabled && <GalleryOrderForm photos={photos} />}
    </SectionContainer>
  );
};

export default Gallery;

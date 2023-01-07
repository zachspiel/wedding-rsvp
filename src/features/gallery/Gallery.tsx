/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { onValue, ref } from "firebase/database";
import { listAll, ref as storageRef } from "firebase/storage";
import { database, storage } from "../database/database";
import GalleryImage from "./GalleryImage";
import UploadImages from "./UploadImages";
import useAdminView from "../../hooks/adminView";

export interface Captions {
  [key: string]: string;
}

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const theme = useMantineTheme();
  const [captions, setCaptions] = useState<Captions>({});
  const [images, setAvailableImages] = useState<string[]>([]);
  const [enabledImages, setEnabledImges] = useState<string[]>([]);
  const captionsRef = ref(database, "admin/captions/");
  const enabledImagesRef = ref(database, "admin/enabledImages/");
  const imagesRef = storageRef(storage, "gallery/");

  React.useEffect(() => {
    listAll(imagesRef).then((result) => {
      setAvailableImages(result.items.map((item) => item.name));
    });
  }, [imagesRef]);

  React.useEffect(() => {
    onValue(captionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setCaptions(data);
      }
    });
  }, []);

  React.useEffect(() => {
    onValue(enabledImagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setEnabledImges(data);
      }
    });
  }, []);

  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const availableImages = isAdminViewEnabled
    ? images
    : images.filter((image) => enabledImages.includes(image));
  const slides = availableImages.map((item) => (
    <Carousel.Slide key={item}>
      {
        <GalleryImage
          image={item}
          caption={captions[item.replace(".", "")] ?? ""}
          displayAdminView={isAdminViewEnabled}
          enabledImages={enabledImages}
        />
      }
    </Carousel.Slide>
  ));

  return (
    <>
      <Title
        order={2}
        size="h1"
        sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
        weight={900}
        align="left"
        id="gallery"
      >
        Gallery
      </Title>

      {isAdminViewEnabled && <UploadImages />}

      <Carousel
        slideSize="50%"
        breakpoints={[{ maxWidth: "sm", slideSize: "100%", slideGap: 2 }]}
        slideGap="xl"
        align="start"
        withIndicators
        slidesToScroll={mobile ? 1 : 2}
      >
        {slides}
      </Carousel>
    </>
  );
};

export default Gallery;

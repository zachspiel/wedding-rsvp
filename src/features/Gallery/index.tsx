"use client";

import { Carousel } from "@mantine/carousel";
import GalleryImage from "./components/GalleryImage";
import UploadImages from "./components/UploadImages";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import { getPhotoGallery, GALLERY_SWR_KEY } from "@spiel-wedding/hooks/gallery";
import useSWR from "swr";
import classes from "./gallery.module.css";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { Photo } from "@spiel-wedding/types/Photo";

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const { data: photos } = useSWR(GALLERY_SWR_KEY, getPhotoGallery);
  const [orderedPhotos, setOrderedPhotos] = useState<Photo[] | undefined>();
  const [openModal, setOpenModal] = useState(false);

  const createSlides = (images?: Photo[], updateOrderedPhotos?: boolean) => {
    return images
      ?.filter((photo) => (isAdminViewEnabled ? true : photo.isVisible))
      .map((photo) => (
        <Carousel.Slide key={photo.id}>
          <GalleryImage
            image={photo}
            displayAdminView={isAdminViewEnabled}
            openImage={() => {
              if (updateOrderedPhotos) {
                const newOrderedPhotos = images.filter((item) => item.id !== photo.id);
                newOrderedPhotos.unshift(photo);

                setOpenModal(true);
                setOrderedPhotos(newOrderedPhotos);
              }
            }}
          />
        </Carousel.Slide>
      ));
  };

  return (
    <SectionContainer id="gallery" greenBackground flowerImages>
      <SectionTitle title="Gallery" hideFlowers={(photos ?? []).length > 0} />
      {isAdminViewEnabled && <UploadImages />}

      <Carousel
        slideSize={{ base: "100%", sm: "50%" }}
        slideGap="md"
        loop
        withIndicators
        classNames={classes}
      >
        {createSlides(photos, true)}
      </Carousel>

      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        transitionProps={{ transition: "fade", duration: 200 }}
        centered
        size="calc(100vw - 3rem)"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Carousel
          slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
          slideGap={{ base: 0, sm: "md" }}
          loop
          align="start"
          withIndicators
          classNames={classes}
        >
          {createSlides(orderedPhotos)}
        </Carousel>
      </Modal>
    </SectionContainer>
  );
};

export default Gallery;

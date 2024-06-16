"use client";

import { Carousel } from "@mantine/carousel";
import GalleryImage from "./components/GalleryImage";
import UploadImages from "./components/UploadImages";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { SectionContainer, SectionTitle } from "../../components/common";
import { getPhotoGallery, GALLERY_SWR_KEY } from "@spiel-wedding/hooks/gallery";
import useSWR from "swr";
import classes from "./gallery.module.css";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { Photo } from "@spiel-wedding/types/Photo";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

const Gallery = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const { data: photos } = useSWR(GALLERY_SWR_KEY, getPhotoGallery, {
    revalidateOnFocus: false,
  });
  const [orderedPhotos, setOrderedPhotos] = useState<Photo[] | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const createSlides = (
    objectFit: "cover" | "contain",
    images?: Photo[],
    updateOrderedPhotos?: boolean
  ) => {
    return images
      ?.filter((photo) => (isAdminViewEnabled ? true : photo.isVisible))
      .map((photo) => (
        <Carousel.Slide key={photo.gallery_id}>
          <GalleryImage
            image={photo}
            displayAdminView={isAdminViewEnabled}
            isOpen={!updateOrderedPhotos ? openModal : false}
            objectFit={objectFit}
            openImage={() => {
              if (updateOrderedPhotos) {
                const newOrderedPhotos = images.filter(
                  (item) => item.gallery_id !== photo.gallery_id
                );
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
    <SectionContainer>
      <SectionTitle id="gallery" title="Gallery" />
      {isAdminViewEnabled && <UploadImages />}

      <Carousel
        slideSize={{ base: "100%", sm: "60%" }}
        slideGap="md"
        loop
        withIndicators
        classNames={classes}
        previousControlProps={{ "aria-label": "Previous Image" }}
        nextControlProps={{ "aria-label": "Next Image" }}
      >
        {createSlides("cover", photos, true)}
      </Carousel>

      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        transitionProps={{ transition: "slide-up", duration: 200 }}
        centered
        fullScreen
        size="calc(100vw - 3rem)"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        closeButtonProps={{
          icon: <IconX color="#ffffff" />,
          bg: "#717769",
          size: isMobile ? "lg" : "",
        }}
        classNames={classes}
      >
        <Carousel
          slideSize={{ base: "100%" }}
          slideGap={{ base: 0, sm: "md" }}
          loop
          withIndicators
          classNames={classes}
        >
          {createSlides("contain", orderedPhotos)}
        </Carousel>
      </Modal>
    </SectionContainer>
  );
};

export default Gallery;

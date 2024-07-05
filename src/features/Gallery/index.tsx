"use client";

import { Carousel } from "@mantine/carousel";
import { Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { Photo } from "@spiel-wedding/types/Photo";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { SectionContainer, SectionTitle } from "../../components/common";
import GalleryImage from "./components/GalleryImage";
import UploadImages from "./components/UploadImages";
import classes from "./gallery.module.css";

interface Props {
  gallery: Photo[];
}

const Gallery = ({ gallery }: Props): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const [orderedPhotos, setOrderedPhotos] = useState<Photo[]>(gallery);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const createSlides = (
    objectFit: "cover" | "contain",
    images: Photo[],
    updateOrderedPhotos?: boolean
  ) => {
    return images
      .filter((image) => (!isAdminViewEnabled ? image.isVisible : true))
      .map((photo) => (
        <Carousel.Slide key={photo.gallery_id}>
          <GalleryImage
            image={photo}
            isOpen={!updateOrderedPhotos ? opened : false}
            objectFit={objectFit}
            openImage={() => {
              if (updateOrderedPhotos) {
                const newOrderedPhotos = images.filter(
                  (item) => item.gallery_id !== photo.gallery_id
                );
                newOrderedPhotos.unshift(photo);

                open();
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
      <UploadImages />

      <Carousel
        slideSize={{ base: "100%", sm: "60%" }}
        slideGap="md"
        loop
        withIndicators
        classNames={classes}
        previousControlProps={{ "aria-label": "Previous Image" }}
        nextControlProps={{ "aria-label": "Next Image" }}
      >
        {createSlides("cover", orderedPhotos, true)}
      </Carousel>

      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "slide-up", duration: 200 }}
        centered
        fullScreen
        size="calc(100vw - 3rem)"
        closeButtonProps={{
          icon: <IconX color="#ffffff" />,
          bg: "#717769",
          size: isMobile ? "lg" : "",
        }}
        classNames={classes}
      >
        <Carousel
          slideSize={{ base: "100%", lg: "50%" }}
          slideGap={"sm"}
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

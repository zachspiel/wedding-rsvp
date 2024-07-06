"use client";

import { Carousel, Embla } from "@mantine/carousel";
import { Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { Photo } from "@spiel-wedding/types/Photo";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SectionContainer, SectionTitle } from "../../components/common";
import GalleryImage from "./components/GalleryImage";
import UploadImages from "./components/UploadImages";
import classes from "./gallery.module.css";

interface Props {
  gallery: Photo[];
}

const Gallery = ({ gallery }: Props): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>();

  useEffect(() => {
    if (!opened) {
      setScrollToIndex(null);
    }

    if (scrollToIndex && embla) {
      embla?.scrollTo(scrollToIndex, true);
    }
  }, [opened, embla]);

  const createSlides = (objectFit: "cover" | "contain", updateOrderedPhotos = false) => {
    return gallery
      .filter((image) => (!isAdminViewEnabled ? image.isVisible : true))
      .map((photo, index) => (
        <Carousel.Slide key={photo.gallery_id}>
          <GalleryImage
            image={photo}
            displayAdminView={isAdminViewEnabled}
            isOpen={!updateOrderedPhotos ? opened : false}
            objectFit={objectFit}
            openImage={() => {
              if (updateOrderedPhotos) {
                setScrollToIndex(index);
                open();
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
        {createSlides("cover", true)}
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
          getEmblaApi={setEmbla}
        >
          {createSlides("contain")}
        </Carousel>
      </Modal>
    </SectionContainer>
  );
};

export default Gallery;

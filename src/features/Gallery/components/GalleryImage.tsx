"use client";

import { Flex, Paper, Title } from "@mantine/core";
import { Photo } from "@spiel-wedding/types/Photo";
import cx from "clsx";
import Image from "next/image";
import { ReactElement } from "react";
import classes from "../gallery.module.css";
import EditImage from "./EditImage";
import ImageVisibilityToggle from "./ImageVisibilityToggle";
import { GALLERY_STORAGE_BUCKET } from "@spiel-wedding/constants";

interface Props {
  image: Photo;
  displayAdminView: boolean;
  isOpen?: boolean;
  objectFit?: "contain" | "cover";
  openImage?: () => void;
}

const getPublicImageUrl = (path: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${GALLERY_STORAGE_BUCKET}/${path}`;
};

const GalleryImage = ({
  image,
  displayAdminView,
  isOpen,
  objectFit,
  openImage,
}: Props): ReactElement => {
  const publicUrl = getPublicImageUrl(image.imagePath);

  return (
    <Paper
      bg="none"
      radius="md"
      mb="xl"
      className={cx(classes.card, isOpen ? classes.cardModal : "")}
      onClick={openImage}
    >
      <Image
        src={publicUrl}
        alt={image.caption ?? image.gallery_id}
        className={cx(classes.cardImage, !isOpen ? classes.cardWithHover : "")}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit,
          zIndex: 0,
        }}
        quality={80}
        loading="lazy"
        blurDataURL={image.blurDataUrl}
        placeholder={image.blurDataUrl === undefined ? "empty" : "blur"}
      />

      <Flex wrap="wrap" w="100%" className={classes.adminControlsContainer} m="md">
        <ImageVisibilityToggle photo={image} />
        <Title order={2} className={classes.title}>
          {image.caption}
        </Title>
        {displayAdminView && <EditImage image={image} />}
      </Flex>
    </Paper>
  );
};

export default GalleryImage;

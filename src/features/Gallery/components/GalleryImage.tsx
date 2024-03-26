"use client";

import { Flex, Paper, Title } from "@mantine/core";
import { Photo } from "@spiel-wedding/types/Photo";
import ImageVisibilityToggle from "./ImageVisibilityToggle";
import EditImage from "./EditImage";
import Image from "next/image";
import { supabase } from "@spiel-wedding/database/database";
import cx from "clsx";
import classes from "../gallery.module.css";
import useSWR from "swr";

interface Props {
  image: Photo;
  displayAdminView: boolean;
  isOpen?: boolean;
  objectFit?: "contain" | "cover";
  openImage?: () => void;
}

const getPlaceholder = async (url: string) => {
  const { data } = await fetch(`/api/placeholder?imageUrl=${url}`).then((res) =>
    res.json(),
  );

  return data;
};

const GalleryImage = ({
  image,
  displayAdminView,
  isOpen,
  objectFit,
  openImage,
}: Props): JSX.Element => {
  const { data } = supabase.storage.from("gallery").getPublicUrl(image.imagePath);
  const { data: placeholder } = useSWR(
    [`placeholder-${image}`, data.publicUrl],
    ([key, url]) => getPlaceholder(url),
  );

  return (
    <Paper
      bg="none"
      radius="md"
      mb="xl"
      className={cx(classes.card, isOpen ? classes.cardModal : "")}
      onClick={openImage}
    >
      <Image
        src={data.publicUrl}
        alt={image.caption ?? image.id}
        className={cx(classes.cardImage, !isOpen ? classes.cardWithHover : "")}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit,
          zIndex: 0,
          transform: "translate3d(0, 0, 0)",
        }}
        placeholder={placeholder ?? "empty"}
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

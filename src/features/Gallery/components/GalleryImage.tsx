"use client";

import { Flex, Paper, Title } from "@mantine/core";
import { createClient } from "@spiel-wedding/database/client";
import { Photo } from "@spiel-wedding/types/Photo";
import cx from "clsx";
import Image from "next/image";
import useSWR from "swr";
import classes from "../gallery.module.css";
import EditImage from "./EditImage";
import ImageVisibilityToggle from "./ImageVisibilityToggle";

interface Props {
  image: Photo;
  displayAdminView: boolean;
  isOpen?: boolean;
  objectFit?: "contain" | "cover";
  openImage?: () => void;
}

const getPlaceholder = async (url: string) => {
  const { data } = await fetch(`/api/placeholder?imageUrl=${url}`).then((res) =>
    res.json()
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
  const supabase = createClient();
  const { data } = supabase.storage.from("gallery").getPublicUrl(image.imagePath);
  const { data: placeholder } = useSWR(
    [`placeholder-${data.publicUrl}`, data.publicUrl],
    ([key, url]) => getPlaceholder(url),
    { revalidateOnFocus: false }
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
        key={data.publicUrl}
        src={data.publicUrl}
        alt={image.caption ?? image.gallery_id}
        className={cx(classes.cardImage, !isOpen ? classes.cardWithHover : "")}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit,
          zIndex: 0,
          transform: "translate3d(0, 0, 0)",
        }}
        blurDataURL={placeholder}
        placeholder={placeholder === undefined ? "empty" : "blur"}
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

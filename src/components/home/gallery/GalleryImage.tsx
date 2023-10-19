"use client";

import { Flex, Paper, Switch, Title, useMantineTheme } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import EditImage from "./EditImage";
import { Photo } from "@spiel-wedding/types/Photo";
import { ref, set } from "firebase/database";
import { database } from "@spiel-wedding/database/database";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./gallery.module.css";

interface Props {
  image: Photo;
  displayAdminView: boolean;
}

const GalleryImage = (props: Props): JSX.Element => {
  const { image, displayAdminView } = props;
  const theme = useMantineTheme();
  const [checked, setChecked] = useState(image.isVisible);

  useEffect(() => {
    if (image.isVisible !== checked) {
      setChecked(image.isVisible);
    }
  }, [image.isVisible]);

  const toggleVisibility = (isVisible: boolean): void => {
    const successMessage = isVisible ? "public" : "hidden";

    set(ref(database, `photos/${image.id}/isVisible`), isVisible)
      .then(() => {
        showSuccessNotification(`Image visibility is now  ${successMessage}`);
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  return (
    <Paper shadow="md" p="xl" radius="md" className={classes.card}>
      <Image
        src={image.downloadUrl}
        alt={image.caption ?? image.id}
        className={classes.cardImage}
        fill
        priority
        sizes="(max-width: 768px) 33vw"
        style={{ objectFit: "cover", zIndex: 0 }}
      />

      <Flex wrap="wrap" w="100%" className={classes.cardContent}>
        {displayAdminView && (
          <Switch
            checked={checked}
            onChange={(event): void => {
              toggleVisibility(event.currentTarget.checked);
              setChecked(event.currentTarget.checked);
            }}
            color="teal"
            size="md"
            mt="md"
            mr="md"
            thumbIcon={
              checked ? (
                <IconCheck size="0.8rem" color={theme.colors.teal[6]} stroke={3} />
              ) : (
                <IconX size="0.8rem" color={theme.colors.red[6]} stroke={3} />
              )
            }
          />
        )}
        <Title order={2} className={classes.title}>
          {image.caption}
        </Title>
        {displayAdminView && <EditImage image={image} />}
      </Flex>
    </Paper>
  );
};

export default GalleryImage;

"use client";

import {
  ActionIcon,
  createStyles,
  Flex,
  getStylesRef,
  Paper,
  Switch,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconEye, IconX } from "@tabler/icons-react";
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

interface Props {
  image: Photo;
  displayAdminView: boolean;
}

const useStyles = createStyles((theme) => ({
  card: {
    [theme.fn.smallerThan("md")]: {
      height: 440,
    },
    [theme.fn.largerThan("md")]: {
      height: 540,
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 24,
    marginTop: theme.spacing.xs,
  },

  cardContent: {
    zIndex: 1,
    position: "relative",
  },

  cardImage: {
    height: 440,
    borderRadius: theme.radius.md,
  },
}));

const GalleryImage = (props: Props): JSX.Element => {
  const { image, displayAdminView } = props;
  const theme = useMantineTheme();
  const [checked, setChecked] = useState(image.isVisible);
  const { classes } = useStyles();

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

  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#bbb" offset="20%" />
          <stop stop-color="#ddd" offset="50%" />
          <stop stop-color="#bbb" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#bbb" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <Paper shadow="md" p="xl" radius="md" className={classes.card}>
      <Image
        src={image.downloadUrl}
        alt={image.caption ?? image.id}
        className={classes.cardImage}
        fill
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
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
                <IconCheck
                  size="0.8rem"
                  color={theme.colors.teal[theme.fn.primaryShade()]}
                  stroke={3}
                />
              ) : (
                <IconX
                  size="0.8rem"
                  color={theme.colors.red[theme.fn.primaryShade()]}
                  stroke={3}
                />
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

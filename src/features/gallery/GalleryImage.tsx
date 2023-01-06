import React, { useState } from "react";
import { ActionIcon, createStyles, Flex, Paper, Title } from "@mantine/core";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../database/database";
import { IconEye, IconEyeOff } from "@tabler/icons";
import EditImage from "./EditImage";

interface Props {
  image: string;
  caption: string;
  displayAdminView: boolean;
  enabledImages: string[];
}

const useStyles = createStyles((theme) => ({
  card: {
    height: 440,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs,
  },
}));

const GalleryImage = (props: Props): JSX.Element => {
  const { image, caption, displayAdminView, enabledImages } = props;
  const [url, setUrl] = useState("");
  const { classes } = useStyles();

  React.useEffect(() => {
    const pathReference = ref(storage, `gallery/${image}`);
    getDownloadURL(pathReference).then((url) => {
      setUrl(url);
    });
  }, [image]);

  const getStatusIcon = (): JSX.Element => {
    return enabledImages.includes(image) ? (
      <IconEye size={16} />
    ) : (
      <IconEyeOff size={16} />
    );
  };
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${url})` }}
      className={classes.card}
    >
      <Flex wrap="wrap">
        {displayAdminView && (
          <ActionIcon
            variant="filled"
            color="blue"
            sx={{ marginTop: "15px", marginRight: "0.5rem" }}
          >
            {getStatusIcon()}
          </ActionIcon>
        )}
        <Title order={3} className={classes.title}>
          {caption}
        </Title>
        {displayAdminView && (
          <EditImage caption={caption} image={image} enabledImages={enabledImages} />
        )}
      </Flex>
    </Paper>
  );
};

export default GalleryImage;

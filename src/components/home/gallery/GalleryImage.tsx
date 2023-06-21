"use client";
import { createStyles, Flex, Paper, Switch, Title, useMantineTheme } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import EditImage from "./EditImage";
import { Photo } from "@spiel-wedding/types/Photo";
import { ref, set } from "firebase/database";
import { database } from "@spiel-wedding/database/database";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { useState } from "react";

interface Props {
  image: Photo;
  displayAdminView: boolean;
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
  const { image, displayAdminView } = props;
  const theme = useMantineTheme();
  const [checked, setChecked] = useState(image.isVisible);
  const { classes } = useStyles();

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
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${image.downloadUrl})` }}
      className={classes.card}
    >
      <Flex wrap="wrap" w="100%">
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
        <Title order={3} className={classes.title}>
          {image.caption}
        </Title>
        {displayAdminView && <EditImage image={image} />}
      </Flex>
    </Paper>
  );
};

export default GalleryImage;

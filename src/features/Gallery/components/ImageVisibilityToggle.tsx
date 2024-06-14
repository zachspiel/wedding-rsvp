"use client";

import { Switch, useMantineTheme } from "@mantine/core";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { GALLERY_SWR_KEY, updatePhoto } from "@spiel-wedding/hooks/gallery";
import { Photo } from "@spiel-wedding/types/Photo";
import { IconCheck, IconX } from "@tabler/icons-react";
import { mutate } from "swr";

interface Props {
  photo: Photo;
}

const ImageVisibilityToggle = ({ photo }: Props): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const theme = useMantineTheme();

  const toggleVisibility = async (isVisible: boolean) => {
    const updatedPhoto = await updatePhoto(photo.gallery_id, { isVisible });
    const successMessage = isVisible ? "public" : "hidden";

    if (updatedPhoto) {
      showSuccessNotification(`Image visibility is now  ${successMessage}`);
      await mutate(GALLERY_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  return (
    <>
      {isAdminViewEnabled && (
        <Switch
          checked={photo.isVisible}
          onChange={(event): void => {
            toggleVisibility(event.currentTarget.checked);
          }}
          color="teal"
          size="md"
          mt="md"
          mr="md"
          thumbIcon={
            photo.isVisible ? (
              <IconCheck size="0.8rem" color={theme.colors.teal[6]} stroke={3} />
            ) : (
              <IconX size="0.8rem" color={theme.colors.red[6]} stroke={3} />
            )
          }
        />
      )}
    </>
  );
};

export default ImageVisibilityToggle;

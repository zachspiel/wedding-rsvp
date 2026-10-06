"use client";

import { ActionIcon, Button, Group, Modal, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { GALLERY_SWR_KEY, removeImage, updatePhoto } from "@spiel-wedding/hooks/gallery";
import { Photo } from "@spiel-wedding/types/Photo";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ReactElement, useState } from "react";
import { useSWRConfig } from "swr";

interface Props {
  image: Photo;
}

const EditImage = ({ image }: Props): ReactElement => {
  const [opened, setOpened] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useForm({
    initialValues: { ...image },
  });

  const handleSubmit = async () => {
    const photo = await updatePhoto(image.gallery_id, form.getTransformedValues());

    if (photo) {
      showSuccessNotification("Successfully updated image!");
      setOpened(false);
      await mutate(GALLERY_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  const deleteImage = async () => {
    const removedFile = await removeImage(image);
    setShowConfirmDelete(false);

    if (removedFile && removedFile.length > 0) {
      showSuccessNotification("Successfully deleted image!");
      setOpened(false);
      await mutate(GALLERY_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  return (
    <>
      <ActionIcon
        variant="filled"
        color="blue"
        onClick={(): void => setOpened(true)}
        style={{ marginTop: "15px", marginLeft: "0.5rem" }}
      >
        <IconPencil size={16} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={(): void => setOpened(false)}
        title={`Edit ${image.caption}`}
        withCloseButton
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            placeholder="Caption"
            label="Caption"
            {...form.getInputProps("caption")}
          />

          <Switch
            style={{ marginTop: "0.5rem" }}
            label="Is publicly visible"
            checked={form.values.isVisible}
            {...form.getInputProps("isVisible")}
          />

          <Group align="right" mt="md">
            {!showConfirmDelete && (
              <Button
                variant="subtle"
                color="red"
                leftSection={<IconTrash />}
                onClick={(): void => setShowConfirmDelete(true)}
              >
                Delete Image
              </Button>
            )}

            {showConfirmDelete && (
              <>
                <Button
                  variant="subtle"
                  onClick={(): void => setShowConfirmDelete(false)}
                >
                  Cancel
                </Button>

                <Button color="red" onClick={() => deleteImage()}>
                  Confirm
                </Button>
              </>
            )}

            {form.isDirty() && <Button type="submit">Submit</Button>}
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default EditImage;

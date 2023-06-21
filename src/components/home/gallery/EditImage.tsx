"use client";

import { Modal, TextInput, Group, Button, ActionIcon, Switch } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ref, remove, set } from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { database, storage } from "@spiel-wedding/database/database";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { Photo } from "@spiel-wedding/types/Photo";
import { useState } from "react";

interface Props {
  image: Photo;
}

const EditImage = (props: Props): JSX.Element => {
  const { image } = props;
  const [opened, setOpened] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const form = useForm({
    initialValues: { ...image },

    validate: {
      caption: isNotEmpty("Please enter a caption"),
    },
  });

  const handleSubmit = (): void => {
    set(ref(database, `photos/${image.id}`), { ...form.values })
      .then(() => {
        showSuccessNotification("Successfully updated image!");
        setOpened(false);
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  const onSuccessfulDelete = (): void => {
    remove(ref(database, `photos/${image.id}`))
      .then(() => {
        showSuccessNotification("Successfully deleted image!");
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  const onDeletionError = (): void => {
    showFailureNotification();
  };

  const deleteImage = (): void => {
    const imageRef = storageRef(storage, image.filePath);
    setShowConfirmDelete(false);

    deleteObject(imageRef)
      .then(() => {
        onSuccessfulDelete();
        setOpened(false);
      })
      .catch((error) => {
        onDeletionError();
      });
  };

  return (
    <>
      <ActionIcon
        variant="filled"
        color="blue"
        onClick={(): void => setOpened(true)}
        sx={{ marginTop: "15px", marginLeft: "0.5rem" }}
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
            sx={{ marginTop: "0.5rem" }}
            label="Is publicly visible"
            checked={form.values.isVisible}
            {...form.getInputProps("isVisible")}
          />

          <Group position="right" mt="md">
            {!showConfirmDelete && (
              <Button
                variant="subtle"
                color="red"
                leftIcon={<IconTrash />}
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

                <Button color="red" onClick={(): void => deleteImage()}>
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

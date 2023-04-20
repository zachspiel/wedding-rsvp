import React, { useState } from "react";
import { Modal, TextInput, Group, Button, ActionIcon, Switch } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconPencil } from "@tabler/icons";
import { ref, remove, set } from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { database, storage } from "../../../database/database";
import {
  showFailureNotification,
  showSuccessNotification,
} from "../../../components/notifications/notifications";
import { Photo } from "../../../types/Photo";

interface Props {
  image: Photo;
}

const EditImage = (props: Props): JSX.Element => {
  const { image } = props;
  const [opened, setOpened] = useState(false);

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
        title={`Edit ${image}`}
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
            <Button variant="subtle" color="red" onClick={(): void => deleteImage()}>
              Delete
            </Button>

            {form.isDirty() && <Button type="submit">Submit</Button>}
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default EditImage;

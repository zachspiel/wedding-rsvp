import { Modal, TextInput, Group, Button, ActionIcon, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons";
import { ref, set } from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import React, { useState } from "react";
import { database, storage } from "../database/database";

interface Props {
  image: string;
  caption: string;
  enabledImages: string[];
}

const EditImage = (props: Props): JSX.Element => {
  const { image, caption, enabledImages } = props;
  const [opened, setOpened] = useState(false);
  const isEnabled = enabledImages.includes(image);

  const form = useForm({
    initialValues: { image, caption, isEnabled },

    validate: {
      image: (value) => image.length === 0,
    },
  });

  const updateCaption = (updatedCaption: string): void => {
    try {
      const updatedImages = isEnabled
        ? enabledImages.filter((file) => file !== image)
        : [...enabledImages, image];

      const path = image.replace(".", "");
      set(ref(database, "admin/captions/" + path), updatedCaption);
      set(ref(database, "admin/enabledImages/"), updatedImages);
      notifications.show({
        message: `Successfully updated!`,
        color: "green",
      });
      setOpened(false);
    } catch (error) {
      notifications.show({
        message: `${error}`,
        color: "red",
      });
    }
  };

  const onSuccessfulDelete = (): void => {
    notifications.show({
      message: "Successfully deleted image.",
      color: "green",
    });
  };

  const onDeletionError = (): void => {
    notifications.show({
      message: "Error while deleting image. Try again later.",
      color: "red",
    });
  };

  const deleteImage = (): void => {
    const imageRef = storageRef(storage, "gallery/" + image);
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
        onClose={() => setOpened(false)}
        title={`Edit ${image}`}
        withCloseButton
      >
        <form onSubmit={form.onSubmit((values) => updateCaption(values.caption))}>
          <TextInput
            placeholder="Caption"
            label="Caption"
            {...form.getInputProps("caption")}
          />

          <Switch
            sx={{ marginTop: "0.5rem" }}
            label="Is publicly visible"
            checked={form.values.isEnabled}
            {...form.getInputProps("isEnabled")}
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

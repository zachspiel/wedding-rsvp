"use client";

import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Text, Group, Button, ActionIcon } from "@mantine/core";
import {
  showSuccessNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { IconTrash } from "@tabler/icons-react";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { mutate } from "swr";
import {
  GALLERY_SWR_KEY,
  removeGuestBookMessage,
} from "@spiel-wedding/hooks/guestbook";

interface Props {
  message: GuestMessage;
}

const DeleteMessageButton = ({ message }: Props): JSX.Element => {
  const [opened, { open, close }] = useDisclosure(false);

  const deleteMessage = async () => {
    const removedMessage = await removeGuestBookMessage(message.id);

    if (removedMessage) {
      showSuccessNotification("Successfully deleted the message!");
      await mutate(GALLERY_SWR_KEY);
    } else {
      showCustomFailureNotification(
        "An error occurred while deleting the message. Please try again later.",
      );
    }
  };

  return (
    <>
      <ActionIcon onClick={open}>
        <IconTrash size={20} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title="Delete Message"
        withCloseButton
      >
        <Text>
          This will permanently delete this message. Do you wish to continue?
        </Text>
        <Group align="flex-end" mt="lg">
          <Button variant="subtle" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={deleteMessage}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DeleteMessageButton;

import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { GuestMessage } from "../GuestBook";
import { Modal, Text, Group, Button, ActionIcon } from "@mantine/core";
import { ref, set } from "firebase/database";
import {
  showSuccessNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { database } from "@spiel-wedding/database/database";
import { IconTrash } from "@tabler/icons-react";

interface Props {
  message: GuestMessage;
}

const DeleteMessageButton = (props: Props): JSX.Element => {
  const [opened, { open, close }] = useDisclosure(false);
  const { message } = props;

  const deleteMessage = (): void => {
    const messageRef = ref(database, `guestBook/${message.id}`);

    set(messageRef, { ...message, isVisible: false })
      .then(() => {
        showSuccessNotification("Successfully deleted the message!");
      })
      .catch(() => {
        showCustomFailureNotification(
          "An error occured while deleting the message. Please try again later.",
        );
      });
  };

  return (
    <>
      <ActionIcon onClick={open}>
        <IconTrash size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Delete Message" withCloseButton>
        <Text>This will permanently delete this message. Do you wish to continue?</Text>
        <Group align="flex-end" position="right" mt="lg">
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

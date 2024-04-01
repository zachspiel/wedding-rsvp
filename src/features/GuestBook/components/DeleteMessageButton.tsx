"use client";

import React from "react";
import { Text, ActionIcon } from "@mantine/core";
import {
  showSuccessNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { IconTrash } from "@tabler/icons-react";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { mutate } from "swr";
import {
  GUESTBOOK_SWR_KEY,
  removeGuestBookMessage,
} from "@spiel-wedding/hooks/guestbook";
import { modals } from "@mantine/modals";

interface Props {
  message: PublicGuestMessage;
}

const DeleteMessageButton = ({ message }: Props): JSX.Element => {
  const deleteMessage = async () => {
    const removedMessage = await removeGuestBookMessage(message.id);

    if (removedMessage) {
      showSuccessNotification("Successfully deleted the message!");
      await mutate(GUESTBOOK_SWR_KEY);
    } else {
      showCustomFailureNotification(
        "An error occurred while deleting the message. Please try again later."
      );
    }
  };

  const openModal = () => {
    modals.openConfirmModal({
      title: "Delete Message",
      centered: true,
      children: (
        <Text>This will permanently delete this message. Do you wish to continue?</Text>
      ),
      labels: {
        confirm: "Delete",
        cancel: "Cancel",
      },
      cancelProps: { variant: "subtle", color: "gray" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeAll(),
      onConfirm: deleteMessage,
    });
  };

  return (
    <ActionIcon onClick={openModal} color="red">
      <IconTrash size={20} />
    </ActionIcon>
  );
};

export default DeleteMessageButton;

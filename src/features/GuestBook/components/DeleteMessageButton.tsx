"use client";

import { ActionIcon, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { IconTrash } from "@tabler/icons-react";
import { deleteGuestMessage } from "../actions";

interface Props {
  message: PublicGuestMessage;
}

const DeleteMessageButton = ({ message }: Props): JSX.Element => {
  const deleteMessage = async () => {
    const removedMessage = await deleteGuestMessage(message.id);

    if (removedMessage) {
      showSuccessNotification("Successfully deleted the message!");
      await revalidatePage("/");
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

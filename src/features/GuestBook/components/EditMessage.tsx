"use client";

import { Button, Group, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { ReactElement } from "react";
import { updateGuestMessage } from "../actions";
import { useRouter } from "next/navigation";

interface Props {
  message: PublicGuestMessage;
  closeEditor: () => void;
}

const EditMessage = ({ message, closeEditor }: Props): ReactElement => {
  const form = useForm({
    initialValues: message,
    validate: {
      message: isNotEmpty("Please enter a message."),
    },
  });

  const updateMessage = async (updatedEntry: PublicGuestMessage) => {
    const guestMessage = await updateGuestMessage(
      updatedEntry.id,
      updatedEntry.message.trim(),
    );

    if (guestMessage.length > 0) {
      showSuccessNotification("Successfully updated message in guest book!");
    } else {
      showCustomFailureNotification(
        "An error occurred while updating the message. Please try again later.",
      );
    }

    closeEditor();
  };

  return (
    <form onSubmit={form.onSubmit(() => updateMessage(form.values))}>
      <Textarea
        mt="md"
        label="Message"
        placeholder="Leave a message"
        maxRows={10}
        minRows={5}
        autosize
        required
        name="message"
        {...form.getInputProps("message")}
      />

      <Group justify="right" mt="md">
        <Button
          size="md"
          onClick={(): void => closeEditor()}
          variant="subtle"
          color="gray"
        >
          Cancel
        </Button>
        <Button type="submit" size="md">
          Save
        </Button>
      </Group>
    </form>
  );
};

export default EditMessage;

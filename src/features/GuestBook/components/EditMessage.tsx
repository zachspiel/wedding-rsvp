"use client";

import React from "react";
import { Textarea, Group, Button } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { updateGuestBookMessage } from "@spiel-wedding/hooks/guestbook";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";

interface Props {
  message: PublicGuestMessage;
  closeEditor: () => void;
}

const EditMessage = ({ message, closeEditor }: Props): JSX.Element => {
  const form = useForm({
    initialValues: message,

    validate: {
      message: isNotEmpty("Please enter a message."),
    },
  });

  const updateMessage = async (updatedEntry: PublicGuestMessage) => {
    const guestMessage = await updateGuestBookMessage(
      updatedEntry.id,
      updatedEntry.message
    );

    if (guestMessage.length > 0) {
      showSuccessNotification("Successfully updated message in guest book!");
      await revalidatePage("/");
    } else {
      showCustomFailureNotification(
        "An error occurred while updating the message. Please try again later."
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

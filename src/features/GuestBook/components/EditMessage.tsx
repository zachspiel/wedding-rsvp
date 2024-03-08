"use client";

import React from "react";
import { Textarea, Group, Button } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { mutate } from "swr";
import {
  GUESTBOOK_SWR_KEY,
  updateGuestBookMessage,
} from "@spiel-wedding/hooks/guestbook";

interface Props {
  message: GuestMessage;
  closeEditor: () => void;
}

const EditMessage = ({ message, closeEditor }: Props): JSX.Element => {
  const form = useForm({
    initialValues: message,

    validate: {
      message: isNotEmpty("Please enter a message."),
    },
  });

  const updateMessage = async (updatedEntry: GuestMessage) => {
    const guestMessage = await updateGuestBookMessage(
      updatedEntry.id,
      updatedEntry.message
    );

    if (guestMessage.length > 0) {
      showSuccessNotification("Successfully updated message in guest book!");
      await mutate(GUESTBOOK_SWR_KEY);
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
        <Button type="submit" size="md" color="teal.5">
          Save
        </Button>
      </Group>
    </form>
  );
};

export default EditMessage;

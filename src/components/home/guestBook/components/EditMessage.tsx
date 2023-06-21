import React from "react";
import { Textarea, Group, Button } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { ref, set } from "firebase/database";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { database } from "@spiel-wedding/database/database";
import { GuestMessage } from "../GuestBook";

interface Props {
  message: GuestMessage;
  closeEditor: () => void;
}

const EditMessage = (props: Props): JSX.Element => {
  const { message, closeEditor } = props;
  const form = useForm({
    initialValues: message,

    validate: {
      message: isNotEmpty("Please enter a message."),
    },
  });

  const updateMessage = (updatedEntry: string): void => {
    let updatedMessage = [message].map((item) => item)[0];

    updatedMessage = {
      ...updatedMessage,
      message: updatedEntry,
      editedAt: new Date().toISOString(),
    };

    const messageRef = ref(database, `guestBook/${message.id}`);

    set(messageRef, updatedMessage)
      .then(() => {
        showSuccessNotification("Successfully updated the message!");
      })
      .catch(() => {
        showCustomFailureNotification(
          "An error occured while updating the message. Please try again later.",
        );
      });

    closeEditor();
  };
  return (
    <form onSubmit={form.onSubmit(() => updateMessage(form.values.message))}>
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

      <Group position="right" mt="md">
        <Button size="md" onClick={(): void => closeEditor()} variant="subtle">
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

"use client";

import { GuestMessage } from "@spiel-wedding/types/Guest";
import { Button, Group, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { addMessageToGuestBook, GUESTBOOK_SWR_KEY } from "@spiel-wedding/hooks/guestbook";
import { showCustomFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { mutate } from "swr";
import { useLocalStorage } from "@mantine/hooks";

interface Props {
  name?: string;
  email?: string;
  handleSubmit: (message: GuestMessage[]) => void;
  customButtonLabel?: string;
  handleSubmitWithoutMessage?: boolean;
}

const GuestBookForm = ({
  name,
  email,
  handleSubmit,
  customButtonLabel,
  handleSubmitWithoutMessage,
}: Props): JSX.Element => {
  const [localMessages, setLocalMessages] = useLocalStorage<string[]>({
    key: "guestMessages",
    defaultValue: [],
  });

  const form = useForm({
    initialValues: {
      name: name ?? "",
      email: email ?? "",
      message: "",
      isVisible: false,
    },
    validate: !handleSubmitWithoutMessage
      ? {
          name: isNotEmpty("Please enter your name to sign the guest book."),
          email: isEmail("Please enter a valid email."),
          message: isNotEmpty("Please enter a message to sign the guest book."),
        }
      : undefined,
  });

  const saveMessage = async (
    newGuestMessage: Omit<GuestMessage, "id">
  ): Promise<void> => {
    if (handleSubmitWithoutMessage && isAnyFieldEmpty(newGuestMessage)) {
      handleSubmit([]);
    } else {
      const guestMessage = await addMessageToGuestBook(newGuestMessage);
      setLocalMessages([...localMessages, guestMessage[0].id]);

      if (guestMessage.length === 0) {
        showCustomFailureNotification(
          "An error occurred while signing the guest book. Please try again later!"
        );
      } else {
        handleSubmit(guestMessage);
        await mutate(GUESTBOOK_SWR_KEY);
      }
    }
  };

  const isAnyFieldEmpty = (newMessage: Omit<GuestMessage, "id">) => {
    const { name, message, email } = newMessage;
    return [name, message, email].filter((item) => item.length === 0).length > 0;
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        saveMessage(form.values);
        form.reset();
      })}
    >
      <SimpleGrid cols={{ xs: 1, sm: 2 }} mt="xl">
        <TextInput
          label="Name"
          placeholder="Your name"
          name="name"
          required={!handleSubmitWithoutMessage}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          name="email"
          required={!handleSubmitWithoutMessage}
          {...form.getInputProps("email")}
        />
      </SimpleGrid>

      <Textarea
        label="Message"
        placeholder="Leave a message"
        maxRows={10}
        minRows={5}
        autosize
        required={!handleSubmitWithoutMessage}
        name="message"
        mt="md"
        {...form.getInputProps("message")}
      />

      {customButtonLabel && (
        <Group justify="end">
          <Button type="submit" mt="md">
            {customButtonLabel}
          </Button>
        </Group>
      )}

      {!customButtonLabel && (
        <Button type="submit" size="md" mt="md" disabled={!form.isValid()}>
          Sign guest book
        </Button>
      )}
    </form>
  );
};

export default GuestBookForm;

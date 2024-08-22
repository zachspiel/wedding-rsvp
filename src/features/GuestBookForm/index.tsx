"use client";

import { Button, Group, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import { showCustomFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { saveGuestMessage, sendEmailForNewComment } from "./action";

interface Props {
  name?: string;
  email?: string;
  handleSubmit: (message: GuestMessage[]) => void;
  customButtonLabel?: string;
  isMessageRequred?: boolean;
}

const GuestBookForm = ({
  name,
  email,
  handleSubmit,
  customButtonLabel,
  isMessageRequred,
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
      isVisible: true,
    },
    validate: isMessageRequred
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
    if (!isMessageRequred && isAnyFieldEmpty(newGuestMessage)) {
      handleSubmit([]);
    } else {
      const guestMessage = await saveGuestMessage(newGuestMessage);

      if (!guestMessage) {
        showCustomFailureNotification(
          "An error occurred while signing the guest book. Please try again later!"
        );
      } else {
        setLocalMessages([...localMessages, guestMessage.id]);
        handleSubmit([guestMessage]);
        await sendEmailForNewComment(guestMessage);
        await revalidatePage("/");
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
          withAsterisk={isMessageRequred}
          {...form.getInputProps("name")}
          error={form.errors["name"]}
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          name="email"
          withAsterisk={isMessageRequred}
          {...form.getInputProps("email")}
          error={form.errors["email"]}
        />
      </SimpleGrid>

      <Textarea
        label="Message"
        placeholder="Leave a message"
        maxRows={10}
        minRows={5}
        autosize
        name="message"
        mt="md"
        withAsterisk={isMessageRequred}
        {...form.getInputProps("message")}
        error={form.errors["message"]}
      />

      {customButtonLabel && (
        <Group justify="end">
          <Button type="submit" mt="md">
            {customButtonLabel}
          </Button>
        </Group>
      )}

      {!customButtonLabel && (
        <Button type="submit" size="md" mt="md">
          Sign guest book
        </Button>
      )}
    </form>
  );
};

export default GuestBookForm;

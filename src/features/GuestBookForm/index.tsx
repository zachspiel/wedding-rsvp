"use client";

import {
  Button,
  Group,
  Progress,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { showCustomFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { ReactElement, useState } from "react";
import { saveGuestMessage, sendEmailForNewComment } from "./action";
import { useRouter } from "next/navigation";

interface Props {
  name?: string;
  email?: string;
  handleSubmit: () => void;
  customButtonLabel?: string;
  isMessageRequred?: boolean;
}

const GuestBookForm = ({
  name,
  email,
  handleSubmit,
  customButtonLabel,
  isMessageRequred,
}: Props): ReactElement => {
  const [isSaving, setIsSaving] = useState(false);
  const [localMessages, setLocalMessages] = useLocalStorage<string[]>({
    key: "guestMessages",
    defaultValue: [],
  });
  const [progress, setProgress] = useState(0);
  const router = useRouter();

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
    newGuestMessage: Omit<GuestMessage, "id">,
  ): Promise<void> => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    if (!isMessageRequred && isAnyFieldEmpty(newGuestMessage)) {
      setProgress(100);
      handleSubmit();
    } else {
      const guestMessage = await saveGuestMessage(newGuestMessage);
      setProgress(33);

      if (!guestMessage) {
        showCustomFailureNotification(
          "An error occurred while signing the guest book. Please try again later!",
        );

        setProgress(100);
      } else {
        setLocalMessages([...localMessages, guestMessage.id]);

        setProgress(66);

        handleSubmit();

        await sendEmailForNewComment(guestMessage);
        setProgress(80);

        router.refresh();
        setProgress(100);

        form.reset();
      }
    }
    setIsSaving(false);
  };

  const isAnyFieldEmpty = (newMessage: Omit<GuestMessage, "id">) => {
    const { name, message, email } = newMessage;
    return [name, message, email].filter((item) => item.length === 0).length > 0;
  };

  return (
    <form onSubmit={form.onSubmit(() => saveMessage(form.values))}>
      {isSaving && progress !== 100 && (
        <>
          <Text>Saving...</Text>
          <Progress color="teal" striped animated value={progress} />
        </>
      )}

      <SimpleGrid cols={{ xs: 1, sm: 2 }} mt="xl">
        <TextInput
          label="Name"
          placeholder="Your name"
          name="name"
          withAsterisk={isMessageRequred}
          key={form.key("name")}
          {...form.getInputProps("name")}
          disabled={isSaving}
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          name="email"
          withAsterisk={isMessageRequred}
          key={form.key("email")}
          {...form.getInputProps("email")}
          disabled={isSaving}
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
        key={form.key("message")}
        {...form.getInputProps("message")}
        disabled={isSaving}
      />

      {customButtonLabel && (
        <Group justify="end">
          <Button type="submit" mt="md" disabled={isSaving}>
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

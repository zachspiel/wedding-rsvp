"use client";
import React from "react";
import { Button, Container, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { ref, set, onValue } from "firebase/database";
import { database } from "../../../database/database";
import GuestBookMessage from "./GuestBookMessage";
import { v4 as uuidv4 } from "uuid";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "../../../components/notifications/notifications";
import { useLocalStorage } from "usehooks-ts";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";

export interface GuestMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isVisible: boolean;
  createdAt?: string;
  editedAt?: string;
}

const GuestBook = (): JSX.Element => {
  const [messages, setMessages] = React.useState<GuestMessage[]>([]);
  const [localMessages, setLocalMessages] = useLocalStorage<string[]>(
    "guestMessages",
    []
  );

  React.useEffect(() => {
    const messagesRef = ref(database, "guestBook/");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      setMessages(Object.values(data));
    });
  }, []);

  const form = useForm({
    initialValues: {
      id: uuidv4(),
      name: "",
      email: "",
      message: "",
      isVisible: true,
    },
    validate: {
      name: isNotEmpty("Please enter your name to sign the guest book."),
      email: isEmail("Please enter a valid email."),
      message: isNotEmpty("Please enter a message to sign the guest book."),
    },
  });

  const saveMessage = (): void => {
    const { id } = form.values;
    const newMessageRef = ref(database, `guestBook/${id}`);
    set(newMessageRef, { ...form.values, createdAt: new Date().toISOString() })
      .then(() => {
        showSuccessNotification("Successfully signed guest book!");
        setLocalMessages([...localMessages, id]);
      })
      .catch(() => {
        showCustomFailureNotification(
          "An error occured while signing the guest book. Please try again later!"
        );
      });

    form.reset();
  };

  return (
    <SectionContainer grayBackground>
      <SectionTitle title="Guest Book" id="guestBook" />
      <form onSubmit={form.onSubmit(() => saveMessage())}>
        <SimpleGrid cols={2} mt="xl" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          <TextInput
            label="Name"
            placeholder="Your name"
            name="name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            required
            {...form.getInputProps("email")}
          />
        </SimpleGrid>

        <Textarea
          label="Message"
          placeholder="Leave a message"
          maxRows={10}
          minRows={5}
          autosize
          required
          name="message"
          {...form.getInputProps("message")}
        />

        <Button type="submit" size="md" mt="md">
          Sign guest book
        </Button>
      </form>

      {messages
        .filter((message) => message.isVisible)
        .map((message) => (
          <GuestBookMessage
            key={message.id}
            message={message}
            localMessages={localMessages}
          />
        ))}
    </SectionContainer>
  );
};

export default GuestBook;

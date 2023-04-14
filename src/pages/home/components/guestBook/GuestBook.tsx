import React from "react";
import { Button, Container, Group, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ref, set, onValue } from "firebase/database";
import { database } from "../../../../database/database";
import GuestBookMessage from "./GuestBookMessage";
import SectionTitle from "../../../../components/common/SectionTitle";
import { v4 as uuidv4 } from "uuid";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "../../../../components/notifications/notifications";
import { saveNewMessageLocally } from "./util";

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
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      message: (value) => value.trim().length < 2,
    },
  });

  const saveMessage = (): void => {
    const { id } = form.values;
    const newMessageRef = ref(database, `guestBook/${id}`);
    set(newMessageRef, { ...form.values, createdAt: new Date().toISOString() })
      .then(() => {
        showSuccessNotification("Successfully signed the guest book!");
        saveNewMessageLocally(id);
      })
      .catch(() => {
        showCustomFailureNotification(
          "An error occured while signing the guest book. Please try again later!",
        );
      });

    form.reset();
  };

  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
          <form onSubmit={form.onSubmit(() => saveMessage())}>
            <SimpleGrid cols={1}>
              <SectionTitle title="Guest Book" id="guestBook" />

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
                mt="md"
                label="Message"
                placeholder="Leave a message"
                maxRows={10}
                minRows={5}
                autosize
                name="message"
                {...form.getInputProps("message")}
              />

              <Group position="left" mt="xl">
                <Button type="submit" size="md">
                  Sign guest book
                </Button>
              </Group>
            </SimpleGrid>
          </form>

          {messages
            .filter((message) => message.isVisible)
            .map((message) => (
              <GuestBookMessage key={message.id} message={message} />
            ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default GuestBook;

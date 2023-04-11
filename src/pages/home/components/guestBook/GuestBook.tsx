import React from "react";
import { Button, Container, Group, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ref, push, set, onValue } from "firebase/database";
import { database } from "../../../../database/database";
import GuestBookMessage from "./GuestBookMessage";
import SectionTitle from "../../../../components/common/SectionTitle";

export interface GuestMessage {
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  editedAt?: string;
}

const GuestBook = (): JSX.Element => {
  const [messages, setMessages] = React.useState<GuestMessage[]>([]);

  React.useEffect(() => {
    const messagesRef = ref(database, "guestBook/");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(Object.values(data));
    });
  }, []);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      message: (value) => value.trim().length < 2,
    },
  });

  const saveMessage = ({ name, email, message }: GuestMessage): void => {
    const postListRef = ref(database, "guestBook");
    const newPostRef = push(postListRef);
    set(newPostRef, {
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });
    form.reset();
  };

  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
          <form onSubmit={form.onSubmit(() => saveMessage(form.values))}>
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

          {messages.map((message, index) => (
            <GuestBookMessage key={index} index={index} messages={messages} />
          ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default GuestBook;

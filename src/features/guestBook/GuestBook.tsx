import React from "react";
import {
  Button,
  Container,
  Group,
  SimpleGrid,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ref, push, set, onValue } from "firebase/database";
import { database } from "../database/database";
import GuestBookMessage from "./GuestBookMessage";

export interface GuestMessage {
  name: string;
  email: string;
  message: string;
  createdAt?: string;
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
    <Container
      sx={{
        backgroundColor: "#f7f7f7",
        padding: "5rem",
        marginTop: "3rem",
      }}
      fluid
    >
      <Container>
        <SimpleGrid cols={1}>
          <form onSubmit={form.onSubmit(() => saveMessage(form.values))}>
            <SimpleGrid cols={1}>
              <Title
                order={2}
                size="h1"
                sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
                weight={900}
                align="left"
                id="guestBook"
              >
                Guest Book
              </Title>

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
            <GuestBookMessage message={message} key={index} />
          ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default GuestBook;

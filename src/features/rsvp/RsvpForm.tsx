import React from "react";
import { useForm } from "@mantine/form";
import {
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Group,
  Button,
  Select,
} from "@mantine/core";
import border from "../../images/bg-right.png";
import { ref, push, set } from "firebase/database";
import { database } from "../database/database";
import { showNotification } from "@mantine/notifications";
import useSignInStatus from "../../hooks/signInStatus";
import RsvpResonses from "./RsvpResonses";

export interface RsvpResonse {
  name: string;
  email: string;
  attending: string;
  songRequest?: string;
  message: string;
  createdAt: string;
}

const RsvpForm = (): JSX.Element => {
  const { isSignedIn } = useSignInStatus();
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      attending: "",
      songRequest: "",
      message: "",
      createdAt: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      attending: (value) => value.length === 0,
    },
  });

  const registerGuest = (response: RsvpResonse): void => {
    const rsvpListRef = ref(database, "rsvpResponses");
    const newRsvpRef = push(rsvpListRef);
    set(newRsvpRef, {
      ...response,
      createdAt: new Date().toISOString(),
    });
    form.reset();

    showNotification({
      title: "Success",
      message: "Your response has been sent successfully!",
      color: "green",
    });
  };

  return (
    <>
      <form onSubmit={form.onSubmit(() => registerGuest(form.values))}>
        <Title
          order={2}
          size="h1"
          sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
          weight={900}
          align="left"
          id="rsvp"
        >
          RSVP
        </Title>

        <SimpleGrid
          cols={2}
          mt="xl"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          sx={{
            background: border,
          }}
        >
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

        <Select
          style={{ marginTop: 20, zIndex: 2 }}
          data={["Yes!", "No"]}
          placeholder="Pick one"
          required
          name="attending"
          label="Will you be attending?"
          {...form.getInputProps("attending")}
        />

        <TextInput
          label="Song Request"
          placeholder="Song request"
          mt="md"
          name="songRequest"
          {...form.getInputProps("songRequest")}
        />
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
          <Button type="submit" size="md" onClick={(): void => console.log("111")}>
            RSVP
          </Button>
        </Group>
      </form>
      {isSignedIn && <RsvpResonses />}
    </>
  );
};

export default RsvpForm;

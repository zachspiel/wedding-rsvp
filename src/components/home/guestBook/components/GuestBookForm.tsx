"use client";

import React from "react";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { Button, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import classes from "../guestbook.module.css";

interface Props {
  handleSubmit: (guestMessage: Omit<GuestMessage, "id">) => void;
}

const GuestBookForm = ({ handleSubmit }: Props): JSX.Element => {
  const form = useForm({
    initialValues: {
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

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit(form.values);
        form.reset();
      })}
    >
      <SimpleGrid cols={{ xs: 1, sm: 2 }} mt="xl">
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
        mt="md"
        {...form.getInputProps("message")}
      />

      <Button type="submit" size="md" mt="md" className={classes.submitButton}>
        Sign guest book
      </Button>
    </form>
  );
};

export default GuestBookForm;

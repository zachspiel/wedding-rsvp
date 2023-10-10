"use client";

import { Container, Title, Paper, TextInput, PasswordInput, Button } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@spiel-wedding/database/database";
import {
  showSuccessNotification,
  showFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { useRouter } from "next/navigation";
import useSignInStatus from "@spiel-wedding/hooks/signInStatus";
import { useEffect } from "react";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  const { isSignedIn } = useSignInStatus();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, []);

  const form = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Please enter a valid email."),
      password: isNotEmpty("Please enter a password"),
    },
  });

  const handleSubmit = ({ email, password }: LoginForm): void => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showSuccessNotification("You have successfully signed in.");
        router.push("/");
      })
      .catch((error) => {
        showFailureNotification();
      });
  };

  return (
    <Container size={420} my={40}>
      <Title
        style={{
          fontFamily: `Greycliff CF, sans-serif`,
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        Hello 👋, please login below
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="Your email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />

          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

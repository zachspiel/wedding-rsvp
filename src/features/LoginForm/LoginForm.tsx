"use client";

import { Button, Container, Paper, PasswordInput, TextInput, Title } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { LoginFormData } from "./types";

const LoginForm = () => {
  const { setUser } = useAdminView();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Please enter a valid email."),
      password: isNotEmpty("Please enter a password"),
    },
  });

  const handleSubmit = async (formData: LoginFormData) => {
    const user = await login(formData);

    if (user) {
      showSuccessNotification("Signed in");
      setUser(user);
      router.push("/");
    } else {
      showCustomFailureNotification("Error signinging in");
    }
  };

  return (
    <>
      <Container size={420} pos="relative">
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
    </>
  );
};

export default LoginForm;

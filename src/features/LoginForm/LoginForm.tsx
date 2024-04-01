"use client";

import {
  Container,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Button,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { LoginFormData } from "./types";
import { login } from "./actions";

const LoginForm = () => {
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
    await login(formData);
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

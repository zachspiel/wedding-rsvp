import React from "react";
import { Container, Title, Paper, TextInput, PasswordInput, Button } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../database/database";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../components/notifications/notifications";
import { useNavigate } from "react-router";

interface LoginForm {
  email: string;
  password: string;
}

const Login = (): JSX.Element => {
  const navigate = useNavigate();
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
        navigate("/");
      })
      .catch((error) => {
        showFailureNotification();
      });
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme): Record<string, string | number> => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
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
};

export default Login;

import React, { useState } from "react";
import { createStyles, Group, Text, Flex, TextInput, Button, Card } from "@mantine/core";
import { GuestMessage } from "./GuestBook";
import { useForm } from "@mantine/form";
import { ref, set } from "firebase/database";
import { database } from "../../../../database/database";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons";

interface Props {
  index: number;
  messages: GuestMessage[];
}

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

const GuestBookMessage = (props: Props): JSX.Element => {
  const { index, messages } = props;
  const guestBookEntry = messages[index];

  const [isEditing, setIsEditing] = useState(false);
  const { classes } = useStyles();

  const form = useForm({
    initialValues: { message: guestBookEntry.message },

    validate: {
      message: (value) => value.length === 0,
    },
  });

  const updateMessage = (updatedMessage: string): void => {
    const updatedMessages = messages.map((message) => message);
    updatedMessages[index] = {
      ...updatedMessages[index],
      message: updatedMessage,
      editedAt: new Date().toISOString(),
    };

    const guestBookRef = ref(database, "guestBook/");

    try {
      set(guestBookRef, [...updatedMessages]);
      notifications.show({
        message: `Successfully updated!`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        message: `${error}`,
        color: "red",
      });
    }

    setIsEditing(false);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        {!isEditing && (
          <div className={classes.content} style={{ fontFamily: `Poppins, sans-serif` }}>
            {`"${guestBookEntry.message}"`}
          </div>
        )}
        {isEditing && (
          <form onSubmit={form.onSubmit(() => updateMessage(form.values.message))}>
            <TextInput
              placeholder="Enter message"
              required
              {...form.getInputProps("message")}
            />
            <Group position="left" mt="xl">
              <Button
                size="md"
                onClick={(): void => setIsEditing(false)}
                variant="subtle"
              >
                Cancel
              </Button>
              <Button type="submit" size="md">
                Save
              </Button>
            </Group>
          </form>
        )}

        <Text color="dimmed">
          <IconTrash size={20} />
        </Text>
      </Group>
      <Group>
        <div>
          <Flex>
            <Text size="xs" color="dimmed">
              by {guestBookEntry.name} -{" "}
              {new Date(guestBookEntry.createdAt ?? "").toDateString()}
            </Text>

            {/*<IconPencil size={16} style={{ marginLeft: "0.5rem" }} onClick={(): void => setIsEditing(!isEditing)}/>*/}
          </Flex>
        </div>
      </Group>
    </Card>
  );
};

export default GuestBookMessage;

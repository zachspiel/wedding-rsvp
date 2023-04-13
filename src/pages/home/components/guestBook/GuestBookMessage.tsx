import React, { useState } from "react";
import {
  createStyles,
  Group,
  Text,
  Flex,
  Button,
  Card,
  Textarea,
  ActionIcon,
} from "@mantine/core";
import { GuestMessage } from "./GuestBook";
import { useForm } from "@mantine/form";
import { ref, set } from "firebase/database";
import { database } from "../../../../database/database";
import { IconPencil, IconTrash } from "@tabler/icons";
import { getLocalMessages } from "./util";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "../../../../components/notifications/notifications";

interface Props {
  message: GuestMessage;
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
  const { message } = props;
  const localMessages = getLocalMessages();
  const isEditable = localMessages.includes(message.id);
  const [isEditing, setIsEditing] = useState(false);
  const { classes } = useStyles();

  const form = useForm({
    initialValues: message,

    validate: {
      message: (value) => value.length === 0,
    },
  });

  const updateMessage = (updatedEntry: string): void => {
    let updatedMessage = [message].map((item) => item)[0];

    updatedMessage = {
      ...updatedMessage,
      message: updatedEntry,
      editedAt: new Date().toISOString(),
    };

    const messageRef = ref(database, `guestBookNew/${message.id}`);

    set(messageRef, updatedMessage)
      .then(() => {
        showSuccessNotification("Successfully updated the message!");
      })
      .catch(() => {
        showCustomFailureNotification(
          "An error occured while updating the message. Please try again later.",
        );
      });

    setIsEditing(false);
  };

  const deleteMessage = (): void => {
    const messageRef = ref(database, `guestBookNew/${message.id}`);

    set(messageRef, { ...message, isVisible: false })
      .then(() => {
        showSuccessNotification("Successfully deleted the message!");
      })
      .catch(() => {
        showCustomFailureNotification(
          "An error occured while deleting the message. Please try again later.",
        );
      });
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {!isEditing && (
        <Group position="apart" mt="md" mb="xs">
          <div className={classes.content} style={{ fontFamily: `Poppins, sans-serif` }}>
            {`"${message.message}"`}
          </div>

          {isEditable && (
            <ActionIcon onClick={deleteMessage}>
              <IconTrash size={20} onClick={deleteMessage} />
            </ActionIcon>
          )}
        </Group>
      )}

      {isEditing && (
        <form onSubmit={form.onSubmit(() => updateMessage(form.values.message))}>
          <Textarea
            mt="md"
            label="Message"
            placeholder="Leave a message"
            maxRows={10}
            minRows={5}
            autosize
            required
            name="message"
            {...form.getInputProps("message")}
          />

          <Group position="right" mt="md">
            <Button size="md" onClick={(): void => setIsEditing(false)} variant="subtle">
              Cancel
            </Button>
            <Button type="submit" size="md">
              Save
            </Button>
          </Group>
        </form>
      )}
      <Group>
        <div>
          <Flex>
            <Text size="xs" color="dimmed">
              by {message.name} - {new Date(message.createdAt ?? "").toDateString()}
            </Text>

            {isEditable && (
              <ActionIcon onClick={(): void => setIsEditing(!isEditing)}>
                <IconPencil size={16} style={{ marginLeft: "0.5rem" }} />
              </ActionIcon>
            )}
          </Flex>
        </div>
      </Group>
    </Card>
  );
};

export default GuestBookMessage;

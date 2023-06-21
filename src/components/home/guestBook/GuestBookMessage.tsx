"use client";
import React, { useState } from "react";
import { createStyles, Group, Text, Flex, Card, ActionIcon } from "@mantine/core";
import { GuestMessage } from "./GuestBook";
import { IconPencil } from "@tabler/icons-react";
import EditMessage from "./components/EditMessage";
import DeleteMessageButton from "./components/DeleteMessageButton";

interface Props {
  message: GuestMessage;
  localMessages: string[];
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
  const { message, localMessages } = props;
  const isEditable = localMessages.includes(message.id);
  const [isEditing, setIsEditing] = useState(false);
  const { classes } = useStyles();

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {!isEditing && (
        <Group position="apart" mt="md" mb="xs">
          <span className={classes.content}>{`"${message.message}"`}</span>

          {isEditable && (
            <Flex>
              <ActionIcon onClick={(): void => setIsEditing(!isEditing)} mr="md">
                <IconPencil size={20} />
              </ActionIcon>

              <DeleteMessageButton message={message} />
            </Flex>
          )}
        </Group>
      )}

      {isEditing && (
        <EditMessage message={message} closeEditor={(): void => setIsEditing(false)} />
      )}

      <Group>
        <div>
          <Flex>
            <Text size="xs" color="dimmed">
              By {message.name} - {new Date(message.createdAt ?? "").toDateString()}
            </Text>
          </Flex>
        </div>
      </Group>
    </Card>
  );
};

export default GuestBookMessage;

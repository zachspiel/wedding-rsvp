"use client";

import React, { useState } from "react";
import { Group, Text, Flex, Card, ActionIcon, CardSection } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import EditMessage from "./EditMessage";
import DeleteMessageButton from "./DeleteMessageButton";
import classes from "../guestbook.module.css";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";

interface Props {
  message: PublicGuestMessage;
  localMessages: string[];
}

const GuestBookMessage = ({ message, localMessages }: Props): JSX.Element => {
  const isEditable = localMessages.includes(message.id);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {!isEditing && (
        <Group justify="space-between" mt="md" mb="xs">
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

      <CardSection className={classes.footer}>
        <Text size="xs" c="dimmed">
          By {message.name} - {new Date(message.createdAt ?? "").toDateString()}
        </Text>
      </CardSection>
    </Card>
  );
};

export default GuestBookMessage;

"use client";

import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "../guestbook.module.css";
import DeleteMessageButton from "./DeleteMessageButton";
import EditMessage from "./EditMessage";

interface Props {
  message: PublicGuestMessage;
  localMessages: string[];
}

const GuestBookMessage = ({ message, localMessages }: Props): JSX.Element => {
  const isEditable = localMessages.includes(message.id);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<string>();

  useEffect(() => {
    if (message.createdAt) {
      setDate(new Date(message.createdAt).toDateString());
    }
  }, []);

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

      <Group>
        <div>
          <Flex>
            <Text size="xs" c="dimmed">
              By {message.name} - {date}
            </Text>
          </Flex>
        </div>
      </Group>
    </Card>
  );
};

export default GuestBookMessage;

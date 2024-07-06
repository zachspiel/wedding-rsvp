"use client";

import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { readLocalStorageValue } from "@mantine/hooks";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "../guestbook.module.css";
import DeleteMessageButton from "./DeleteMessageButton";
import EditMessage from "./EditMessage";

interface Props {
  message: PublicGuestMessage;
}

const GuestBookMessage = ({ message }: Props): JSX.Element => {
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const localMessages: string[] = readLocalStorageValue({
      key: "guestMessages",
      defaultValue: [],
    });
    setIsEditable(localMessages.includes(message.id));

    if (message.createdAt) {
      setDate(new Date(message.createdAt).toDateString());
    }
  }, []);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {!isEditing ? (
        <Group justify="space-between" mt="md" mb="xs">
          <span className={classes.content}>&#34;{message.message}&#34;</span>

          {isEditable && (
            <Flex>
              <ActionIcon onClick={(): void => setIsEditing(!isEditing)} mr="md">
                <IconPencil size={20} />
              </ActionIcon>

              <DeleteMessageButton message={message} />
            </Flex>
          )}
        </Group>
      ) : (
        <EditMessage message={message} closeEditor={(): void => setIsEditing(false)} />
      )}

      <Text size="xs" c="dimmed">
        By {message.name} - {date}
      </Text>
    </Card>
  );
};

export default GuestBookMessage;

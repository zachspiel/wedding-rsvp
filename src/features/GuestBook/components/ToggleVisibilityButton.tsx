"use client";

import React from "react";
import { Switch, useMantineTheme } from "@mantine/core";
import { Text, ActionIcon } from "@mantine/core";
import {
  showSuccessNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { IconTrash } from "@tabler/icons-react";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { IconCheck, IconX } from "@tabler/icons-react";
import { mutate } from "swr";
import {
  GUESTBOOK_SWR_KEY,
  toggleGuestBookMessageVisibility,
} from "@spiel-wedding/hooks/guestbook";
import { modals } from "@mantine/modals";

interface Props {
  message: PublicGuestMessage;
}

const ToggleVisibilityButton = ({ message }: Props): JSX.Element => {
  const theme = useMantineTheme();
  const toggleVIsibility = async () => {
    let isVisible = message.isVisible;
    debugger;
    const removedMessage = await toggleGuestBookMessageVisibility(message.id, isVisible);

    if (removedMessage) {
      showSuccessNotification("Successfully ");
      await mutate(GUESTBOOK_SWR_KEY);
    } else {
      showCustomFailureNotification(
        "An error occurred while deleting the message. Please try again later."
      );
    }
  };

  return (
    <Switch
          checked={message.isVisible}
          onChange={(event): void => {
            toggleVIsibility();
          }}
          color="teal"
          size="md"
          mt="md"
          mr="md"
          thumbIcon={
            message.isVisible ? (
              <IconCheck size="0.8rem" color={theme.colors.teal[6]} stroke={3} />
            ) : (
              <IconX size="0.8rem" color={theme.colors.red[6]} stroke={3} />
            )
          }
        />
  );
};

export default ToggleVisibilityButton;

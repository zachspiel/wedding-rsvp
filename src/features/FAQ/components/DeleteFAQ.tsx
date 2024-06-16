"use client";

import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { removeFAQ } from "@spiel-wedding/hooks/faq";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { IconTrash } from "@tabler/icons-react";
import { mutate } from "swr";

interface Props {
  faq: FrequentlyAskedQuestion;
}

const DeleteFAQ = ({ faq }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = async () => {
    const deletedFAQ = await removeFAQ(faq.faq_id);

    if (deletedFAQ) {
      showSuccessNotification("Removed FAQ!");
      mutate("faq");
      close();
    } else {
      showFailureNotification();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} size="calc(50vw - 3rem)" centered>
        <Text>Are you sure you want to delete this FAQ?</Text>
        <Group justify="end" mt="md">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Confirm</Button>
        </Group>
      </Modal>

      <ActionIcon color="red" onClick={open}>
        <IconTrash />
      </ActionIcon>
    </>
  );
};

export default DeleteFAQ;

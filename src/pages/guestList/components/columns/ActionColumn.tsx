import React from "react";
import { ActionIcon, Button, Group as MGroup, Modal, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons";
import { Group } from "../../../../types/Guest";
import { ref, remove } from "@firebase/database";
import { useDisclosure } from "@mantine/hooks";
import { database } from "../../../../database/database";
import {
  showFailureNotification,
  showSuccessNotification,
} from "../../../../components/notifications/notifications";

interface Props {
  groups: Group[];
  groupIndex: number;
  onEdit: () => void;
}

const ActionColumn = (props: Props): JSX.Element => {
  const { groups, groupIndex, onEdit } = props;
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = (): void => {
    const groupRef = ref(database, `groups/${groups[groupIndex].id}`);
    remove(groupRef)
      .then(() => {
        showSuccessNotification("Successfully deleted guest 🎉");
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  return (
    <>
      <MGroup>
        <ActionIcon onClick={onEdit}>
          <IconPencil />
        </ActionIcon>

        <ActionIcon onClick={open}>
          <IconTrash />
        </ActionIcon>
      </MGroup>
      <Modal opened={opened} onClose={close} centered>
        <Text>This will permanently delete this guest. Do you wish to continue?</Text>
        <MGroup align="flex-end" position="right" mt="lg">
          <Button variant="subtle" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </MGroup>
      </Modal>
    </>
  );
};

export default ActionColumn;

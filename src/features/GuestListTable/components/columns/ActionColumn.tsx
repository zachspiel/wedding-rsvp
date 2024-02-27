import {
  ActionIcon,
  Button,
  Group as MGroup,
  Modal,
  Text,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Group } from "@spiel-wedding/types/Guest";
import { useDisclosure } from "@mantine/hooks";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { deleteGroup, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import { useSWRConfig } from "swr";

interface Props {
  group: Group;
  onEdit: () => void;
}

const ActionColumn = ({ group, onEdit }: Props): JSX.Element => {
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    const removedGroup = await deleteGroup(group.id);

    if (removedGroup) {
      showSuccessNotification("Successfully deleted guests 🎉");
      await mutate(GROUP_SWR_KEY);
      close();
    } else {
      showFailureNotification();
    }
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
        <Text>
          This will permanently delete this group. Do you wish to continue?
        </Text>
        <MGroup align="flex-end" mt="lg">
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

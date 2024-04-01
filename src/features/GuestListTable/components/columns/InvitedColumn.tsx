import { Group as MGroup, Radio } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import {
  showSuccessNotification,
  showFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { updateGroup } from "@spiel-wedding/hooks/guests";

interface Props {
  group: Group;
}

const InvitedColumn = ({ group }: Props): JSX.Element => {
  const handleChange = async (value: string) => {
    const updatedGroup = [group].map((group) => group)[0];
    updatedGroup.invited = value === "definitely";

    const updateGroupResult = await updateGroup(updatedGroup, group);

    if (updateGroupResult) {
      showSuccessNotification("Successfully updated guests 🎉!");
    } else {
      showFailureNotification();
    }
  };

  return (
    <Radio.Group
      name={`invited-${group.id}`}
      mt="lg"
      value={group.invited ? "definitely" : "maybe"}
      onChange={handleChange}
    >
      <MGroup>
        <Radio value="definitely" label="Definitely" />
        <Radio value="maybe" label="Maybe" />
      </MGroup>
    </Radio.Group>
  );
};

export default InvitedColumn;

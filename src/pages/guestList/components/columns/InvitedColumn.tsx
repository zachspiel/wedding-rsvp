import React from "react";
import { Group as MGroup, Radio } from "@mantine/core";
import { ref, set } from "@firebase/database";
import { Group } from "../../../../types/Guest";
import { database } from "../../../../database/database";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../../../components/notifications/notifications";

interface Props {
  groups: Group[];
  index: number;
}

const InvitedColumn = (props: Props): JSX.Element => {
  const { groups, index } = props;

  const handleChange = (value: string): void => {
    const updatedGroup = [groups[index]].map((group) => group)[0];
    updatedGroup.invited = value === "definitely";

    const groupRef = ref(database, `groups/${updatedGroup.id}`);

    set(groupRef, updatedGroup)
      .then(() => {
        showSuccessNotification("Successfully updated guests 🎉!");
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  return (
    <Radio.Group
      name={`invited-${index}`}
      mt="lg"
      value={groups[index].invited ? "definitely" : "maybe"}
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

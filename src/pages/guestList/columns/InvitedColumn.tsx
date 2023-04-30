import React from "react";
import { Group as MGroup, Radio } from "@mantine/core";
import { ref, set } from "@firebase/database";
import { Group } from "../../../types/Guest";
import { database } from "../../../database/database";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../../components/notifications/notifications";

interface Props {
  group: Group;
}

const InvitedColumn = (props: Props): JSX.Element => {
  const { group } = props;

  const handleChange = (value: string): void => {
    const updatedGroup = [group].map((group) => group)[0];
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

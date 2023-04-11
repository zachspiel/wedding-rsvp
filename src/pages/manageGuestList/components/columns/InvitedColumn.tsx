import React from "react";
import { Group as MGroup, Radio } from "@mantine/core";
import { ref, set } from "@firebase/database";
import { notifications } from "@mantine/notifications";
import { Group } from "../../../../types/Guest";
import { database } from "../../../../features/database/database";

interface Props {
  groups: Group[];
  index: number;
}

const InvitedColumn = (props: Props): JSX.Element => {
  const { groups, index } = props;

  const handleChange = (value: string) => {
    const groupsCopy = groups.map((group) => group);
    groupsCopy[index].invited = value === "definitely";

    set(ref(database, "guests"), groupsCopy)
      .then(() => {
        notifications.show({
          title: "Success",
          message: `Successfully updated guests 🎉!`,
          color: "green",
        });
      })
      .catch(() => {
        notifications.show({
          title: "Error",
          message: "Oh no! Better call Zach, and bring some alcohol 😭",
          color: "red",
        });
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

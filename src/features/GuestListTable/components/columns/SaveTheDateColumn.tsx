"use client";

import { Switch } from "@mantine/core";
import { showSuccessNotification } from "@spiel-wedding/components/notifications/notifications";
import { GROUP_SWR_KEY, updateGroup } from "@spiel-wedding/hooks/guests";
import { Group } from "@spiel-wedding/types/Guest";
import { mutate } from "swr";

interface Props {
  group: Group;
}

const SaveTheDateColumn = ({ group }: Props) => {
  const toggleSaveTheDateSent = async () => {
    const result = await updateGroup(
      { ...group, saveTheDateSent: !group.saveTheDateSent },
      group
    );

    if (result) {
      showSuccessNotification("Successfully updated!");
      await mutate(GROUP_SWR_KEY);
    }
  };

  return <Switch checked={group.saveTheDateSent} onChange={toggleSaveTheDateSent} />;
};

export default SaveTheDateColumn;

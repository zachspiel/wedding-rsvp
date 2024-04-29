"use client";

import { Button, Checkbox, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GROUP_SWR_KEY, bulkUpdateGroups } from "@spiel-wedding/hooks/guests";
import {
  showFailureNotification,
  showSuccessNotification,
} from "../notifications/notifications";
import { Group } from "@spiel-wedding/types/Guest";
import { mutate } from "swr";

interface Props {
  groups: Group[];
}

interface FormValues {
  saveTheDateSent: boolean;
}

const BulkEditGroups = ({ groups }: Props) => {
  const form = useForm<FormValues>({
    initialValues: {
      saveTheDateSent: false,
    },
  });

  const handleSubmit = async ({ saveTheDateSent }: FormValues) => {
    const result = await bulkUpdateGroups(
      groups.map((group) => {
        const { guests, rsvpModifications, ...values } = group;
        return { ...values, saveTheDateSent };
      })
    );

    if (result) {
      showSuccessNotification("Successfully updated groups!");
      await mutate(GROUP_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Checkbox
        label={"Save the Date Sent"}
        {...form.getInputProps("saveTheDateSent")}
        mb="md"
      />
      <Flex justify="end">
        <Button type="submit">Submit</Button>
      </Flex>
    </form>
  );
};

export default BulkEditGroups;

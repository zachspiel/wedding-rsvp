"use client";

import { Group as MGroup, Radio } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { RsvpResponse, Group } from "@spiel-wedding/types/Guest";

interface Props {
  form: UseFormReturnType<Group>;
  guestIndex: number;
  responseIndex: number;
}

const RsvpSelection = ({ form, guestIndex, responseIndex }: Props): JSX.Element => {
  const resetUnknownGuest = (index: number): void => {
    const guest = form.values.guests[index];
    if (guest.nameUnknown) {
      form.setFieldValue(`guests.${index}.firstName`, "");
      form.setFieldValue(`guests.${index}.lastName`, "");
    }
  };

  return (
    <Radio.Group
      {...form.getInputProps(
        `guests.${guestIndex}.event_responses.${responseIndex}.rsvp`
      )}
    >
      <MGroup mt="xs">
        <Radio value={RsvpResponse.ACCEPTED} label="Will Attend" />
        <Radio
          value={RsvpResponse.DECLINED}
          label="Will Not Attend"
          onClick={(): void => resetUnknownGuest(guestIndex)}
        />
      </MGroup>
    </Radio.Group>
  );
};

export default RsvpSelection;

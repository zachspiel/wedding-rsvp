import { Group as MGroup, Select, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { EventResponse, Group, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";

interface Props {
  guest: Guest;
  responseIndex: number;
  index: number;
  form: UseFormReturnType<Group>;
}

const RsvpStatus = ({ form, guest, index, responseIndex }: Props): JSX.Element => {
  const dropdownItems = Object.values(RsvpResponse).map((response) => {
    return { value: response, label: response };
  });

  return (
    <MGroup style={{ paddingBottom: "3rem", justifyContent: "space-between" }}>
      <Text>
        {guest.nameUnknown && "Guest"}
        {guest.firstName} {guest.lastName}
      </Text>
      <Select
        name={`rsvp-${index}`}
        {...form.getInputProps(`guests.${index}.event_responses.${responseIndex}.rsvp`)}
        value={form.values.guests[index].event_responses[responseIndex].rsvp}
        data={dropdownItems}
      />
    </MGroup>
  );
};

export default RsvpStatus;

import { Group as MGroup, Select, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Group, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";

interface Props {
  guest: Guest;
  index: number;
  form: UseFormReturnType<Group>;
}

const RsvpStatus = (props: Props): JSX.Element => {
  const { form, guest, index } = props;
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
        {...form.getInputProps(`guests.${index}.rsvp`)}
        value={form.values.guests[index].rsvp}
        data={dropdownItems}
      ></Select>
    </MGroup>
  );
};

export default RsvpStatus;

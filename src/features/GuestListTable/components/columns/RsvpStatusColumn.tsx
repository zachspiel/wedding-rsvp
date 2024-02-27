import { List } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Guest, RsvpResponse } from "@spiel-wedding/types/Guest";

interface Props {
  guests: Guest[];
}

const RsvpStatusColumn = (props: Props): JSX.Element => {
  const { guests } = props;

  return (
    <List listStyleType="none" withPadding>
      {guests.map((guest) => (
        <List.Item key={guest.id}>
          {guest.rsvp === RsvpResponse.ACCEPTED && <IconCheck color="green" />}
          {guest.rsvp !== RsvpResponse.ACCEPTED && <IconX color="red" />}
        </List.Item>
      ))}
    </List>
  );
};

export default RsvpStatusColumn;

import { Badge, List } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Guest, RsvpResponse } from "@spiel-wedding/types/Guest";

interface Props {
  guests: Guest[];
}

const RsvpStatusColumn = ({ guests }: Props): JSX.Element => {
  return (
    <List listStyleType="none" withPadding>
      {guests.map((guest) => (
        <List.Item key={guest.id}>
          {guest.rsvp === RsvpResponse.ACCEPTED && "✅"}
          {guest.rsvp === RsvpResponse.DECLINED && "❌"}
          {guest.rsvp === RsvpResponse.NO_RESPONSE && "🤔"}
        </List.Item>
      ))}
    </List>
  );
};

export default RsvpStatusColumn;

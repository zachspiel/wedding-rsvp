import { List } from "@mantine/core";
import { Guest, RsvpResponse } from "@spiel-wedding/types/Guest";

interface Props {
  guests: Guest[];
}

const RsvpStatusColumn = ({ guests }: Props): JSX.Element => {
  return (
    <List listStyleType="none" withPadding>
      {guests.map((guest) => (
        <List.Item key={guest.guest_id}>
          {guest.rsvp === RsvpResponse.ACCEPTED && "✅"}
          {guest.rsvp === RsvpResponse.DECLINED && "❌"}
          {guest.rsvp === RsvpResponse.NO_RESPONSE && "No Response"}
        </List.Item>
      ))}
    </List>
  );
};

export default RsvpStatusColumn;

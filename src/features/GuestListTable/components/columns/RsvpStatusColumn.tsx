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
          {guest.rsvp === RsvpResponse.ACCEPTED && <IconCheck color="green" />}
          {guest.rsvp === RsvpResponse.DECLINED && <IconX color="red" />}
          {guest.rsvp === RsvpResponse.NO_RESPONSE && (
            <Badge variant="light" size="xs" fz="xs">
              No response
            </Badge>
          )}
        </List.Item>
      ))}
    </List>
  );
};

export default RsvpStatusColumn;

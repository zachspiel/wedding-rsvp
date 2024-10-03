import { List } from "@mantine/core";
import { Event, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";

interface Props {
  guests: Guest[];
  event: Event;
}

const RsvpStatusColumn = ({ guests, event }: Props): JSX.Element => {
  return (
    <List listStyleType="none" withPadding size="lg">
      {getGuestsForEvent(event, guests).map((guest) => {
        const eventResponse = guest.responseMap[event.event_id];

        if (!eventResponse) {
          return <></>;
        }

        return (
          <List.Item key={guest.guest_id}>
            {eventResponse.rsvp === RsvpResponse.ACCEPTED && "✅"}
            {eventResponse.rsvp === RsvpResponse.DECLINED && "❌"}
            {eventResponse.rsvp === RsvpResponse.NO_RESPONSE && "🤷"}
          </List.Item>
        );
      })}
    </List>
  );
};

export default RsvpStatusColumn;

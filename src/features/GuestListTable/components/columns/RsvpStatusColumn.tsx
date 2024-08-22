import { List } from "@mantine/core";
import { Event, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";

interface Props {
  guests: Guest[];
  event: Event;
}

const RsvpStatusColumn = ({ guests, event }: Props): JSX.Element => {
  return (
    <List listStyleType="none" withPadding>
      {getGuestsForEvent(event, guests).map((guest) => {
        const eventResponse = guest.event_responses.find(
          (response) => response.eventId === event.event_id
        );

        if (!eventResponse) {
          return <></>;
        }

        return (
          <List.Item key={guest.guest_id}>
            {eventResponse.rsvp === RsvpResponse.ACCEPTED && "✅"}
            {eventResponse.rsvp === RsvpResponse.DECLINED && "❌"}
            {eventResponse.rsvp === RsvpResponse.NO_RESPONSE && "No Response"}
          </List.Item>
        );
      })}
    </List>
  );
};

export default RsvpStatusColumn;

import { List } from "@mantine/core";
import { Event, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { getGuestResponseForEvent, getGuestsForEvent } from "@spiel-wedding/util";
import { ReactElement } from "react";

interface Props {
  guests: Guest[];
  event: Event;
}

const RsvpStatusColumn = ({ guests, event }: Props): ReactElement => {
  return (
    <List listStyleType="none" withPadding size="lg">
      {getGuestsForEvent(event, guests).map((guest) => {
        const eventResponse = getGuestResponseForEvent(event, guest);

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

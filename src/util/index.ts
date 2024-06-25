import { Event, EventResponse, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { v4 as uuid } from "uuid";

export const getGuestsForEvent = (event: Event, guests: Guest[]) => {
  return guests.filter((guest) =>
    guest.event_responses.some((response) => response.eventId === event.event_id)
  );
};

export const createNewResponse = (guestId: string, eventId: string): EventResponse => {
  return {
    response_id: uuid(),
    guestId,
    eventId: eventId,
    rsvp: RsvpResponse.NO_RESPONSE,
  };
};

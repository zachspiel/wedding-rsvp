import { Event, Guest } from "@spiel-wedding/types/Guest";

export const getGuestsForEvent = (event: Event, guests: Guest[]) => {
  return guests.filter((guest) =>
    guest.event_responses.some((response) => response.eventId === event.event_id)
  );
};

import { Event, EventResponse, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { v4 as uuid } from "uuid";

export const getGuestsForEvent = (event: Event, guests: Guest[]) => {
  return guests.filter((guest) => guest.responseMap[event.event_id] !== undefined);
};

export const addEventResponseMapToGuest = (guests: Guest[]): Guest[] => {
  return guests.map((guest) => {
    const responseMap: Record<string, EventResponse> = {};

    guest.event_responses.forEach(
      (response) => (responseMap[response.eventId] = response)
    );

    return { ...guest, responseMap };
  });
};

export const createNewResponse = (guestId: string, eventId: string): EventResponse => {
  return {
    response_id: uuid(),
    guestId,
    eventId,
    rsvp: RsvpResponse.NO_RESPONSE,
  };
};

export const formatDate = (date: Date) => {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const suffix = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + suffix;

  return (
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime
  );
};

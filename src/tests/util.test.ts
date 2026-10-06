import { RsvpResponse } from "@spiel-wedding/types/Guest";
import { createNewResponse } from "@spiel-wedding/util";
import { expect, test } from "vitest";

test("Create new event response", () => {
  const newEventResponse = createNewResponse("guest-id-1", "event-id-1");

  expect(newEventResponse.guestId).toBe("guest-id-1");
  expect(newEventResponse.eventId).toBe("event-id-1");
  expect(newEventResponse.rsvp).toBe(RsvpResponse.NO_RESPONSE);
});

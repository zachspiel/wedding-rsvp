import {
  bulkUpsertEventResponse,
  deleteEventResponse,
  getEvents,
} from "@spiel-wedding/hooks/events";
import { createGroup, deleteGroup, getGroupById } from "@spiel-wedding/hooks/guests";
import { EventResponse, RsvpResponse } from "@spiel-wedding/types/Guest";
import { createNewResponse } from "@spiel-wedding/util";
import { describe, expect, test } from "vitest";
import { mockGroups } from "../mockData/mockGroups";

describe("Events", async () => {
  const events = await getEvents();

  test("Get events", async () => {
    expect(events).toHaveLength(3);
  });

  test("Update and remove event response", async () => {
    const newGroup = await createGroup(mockGroups[0], events);

    expect(newGroup).toBeDefined();
    const group = await getGroupById(newGroup?.group_id ?? "");

    expect(group).toBeDefined();

    if (group) {
      // Create new response for guest
      const newEventResponse = createNewResponse(
        group.guests[0].guest_id,
        events[0].event_id
      );

      const result = await bulkUpsertEventResponse([newEventResponse]);

      expect(result?.[0]?.rsvp).toBe(RsvpResponse.NO_RESPONSE);

      // Change response to declined
      const modifiedResponse: EventResponse = {
        ...newEventResponse,
        rsvp: RsvpResponse.DECLINED,
      };

      const modifiedResult = await bulkUpsertEventResponse([modifiedResponse]);

      expect(modifiedResult !== null).toBeTruthy();
      expect(modifiedResult?.[0].rsvp).toBe(RsvpResponse.DECLINED);

      // Remove the response and delete group
      const deletedResponse = await deleteEventResponse(modifiedResponse.response_id);

      expect(deletedResponse !== null).toBeTruthy();
      expect(deletedResponse?.response_id).toBe(modifiedResponse.response_id);

      await deleteGroup(group.group_id);
    }
  });
});

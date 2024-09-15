import {
  createDefaultGroup,
  createGuest,
} from "@spiel-wedding/features/AddGroupForm/util";
import { getEvents } from "@spiel-wedding/hooks/events";
import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from "@spiel-wedding/hooks/guests";
import { Event, Group } from "@spiel-wedding/types/Guest";
import { createNewResponse } from "@spiel-wedding/util";
import { beforeAll, describe, expect, test } from "vitest";
import { mockGroups } from "../mockData/mockGroups";

describe("Group Tests", async () => {
  const events: Event[] = [];
  const groups: Group[] = [];

  beforeAll(async () => {
    events.push(...(await getEvents()));
    groups.push(...(await getGroups()));
  });

  test("Get all guests", async () => {
    expect(groups).toBeDefined();
    expect(groups.length).toBeGreaterThan(0);
  });

  test("Guests are formatted correctly", async () => {
    groups.forEach((group) => {
      group.guests.forEach((guest) => {
        expect(guest.firstName.endsWith(" ")).toBeFalsy();
        expect(guest.lastName.endsWith(" ")).toBeFalsy();
      });
    });
  });

  test("Create default group", () => {
    const group = createDefaultGroup(events);

    expect(group.guests).toHaveLength(1);
    expect(group.guests[0].event_responses.length).toBeGreaterThan(0);
  });

  test("Create new guest", () => {
    const guest = createGuest("group-id", events);

    expect(guest.event_responses).toBeDefined();
    expect(guest.event_responses?.length).toBeGreaterThan(0);
  });

  test("Create, Update, and Delete group", async () => {
    const newGroup = await createGroup(mockGroups[0], events);

    expect(newGroup).toBeDefined();
    expect(newGroup?.guests).toHaveLength(1);

    if (newGroup) {
      const modifiedGroup: Group = {
        ...newGroup,
        guests: [
          {
            ...newGroup.guests[0],
            firstName: "Updated First Name",
            lastName: "Updated Last Name",
            event_responses: events.map((event) =>
              createNewResponse(newGroup.guests[0].guest_id, event.event_id)
            ),
          },
        ],
      };

      const updatedGroup = await updateGroup(modifiedGroup, newGroup);

      expect(updatedGroup).toBeDefined();
      expect(updatedGroup?.guests?.length).toBe(1);
      expect(updatedGroup?.guests[0]?.firstName).toBe("Updated First Name");
      expect(updatedGroup?.guests[0]?.lastName).toBe("Updated Last Name");

      const removedGroup = await deleteGroup(newGroup.group_id);
      expect(removedGroup).toBeDefined();
    }
  });
});

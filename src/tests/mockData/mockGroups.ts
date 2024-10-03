import { createDefaultGroup } from "@spiel-wedding/features/AddGroupForm/util";
import { Group } from "@spiel-wedding/types/Guest";
import { mockEvents } from "./mockEvents";

const createMockGroup = (): Group => {
  const defaultGroup = createDefaultGroup(mockEvents);

  return {
    ...defaultGroup,
    guests: defaultGroup.guests.map((guest) => ({
      ...guest,
      firstName: "First name",
      lastName: "Last name",
    })),
  };
};

export const mockGroups: Group[] = [
  createMockGroup(),
  createMockGroup(),
  createMockGroup(),
];

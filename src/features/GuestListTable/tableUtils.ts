import { Group, Guest, GuestAffiliation, RsvpResponse } from "@spiel-wedding/types/Guest";

type GroupFilterableKey = "email" | "address1" | "address2" | "city" | "state";

type GuestFilterableKey = "firstName" | "lastName" | "title";

export type RsvpFilter = Record<string, RsvpResponse[]>;

const filterGroups = (
  groups: Group[],
  search: string,
  filters: string[],
  rsvpFilters?: RsvpFilter
): Group[] => {
  const query = search.toLowerCase().trim();

  if (query.length === 0 && filters.length === 0 && !rsvpFilters) {
    return groups;
  }

  return groups.filter((group) => {
    const containsSearchTerm =
      guestsContainQuery(group.guests, query) || groupContainsQuery(group, query);

    return (
      containsSearchTerm &&
      doesGroupMatchFilter(group, filters) &&
      groupMatchesRsvp(group, rsvpFilters)
    );
  });
};

const groupContainsQuery = (group: Group, query: string): boolean => {
  return Object.keys(group)
    .filter(isGroupFilterableKey)
    .some((key) => group[key].toLowerCase().includes(query));
};

const doesGroupMatchFilter = (group: Group, filters: string[]) => {
  if (filters.length === 0) {
    return true;
  }

  return (
    isGroupMissingValue(group, filters) ||
    groupMatchesAffiliation(group, filters) ||
    guestsMatchEvent(group, filters)
  );
};

const isGroupMissingValue = (group: Group, filters: string[]): boolean => {
  const validEntries = ["email", "address1"];
  const missingValueFilters = filters.filter((filter) => validEntries.includes(filter));

  return Object.keys(group)
    .filter(isGroupFilterableKey)
    .filter((key) => missingValueFilters.includes(key))
    .some((key) => group[key].trim().length === 0);
};

const groupMatchesAffiliation = (group: Group, filters: string[]): boolean => {
  const validEntries = Object.values(GuestAffiliation).map((value) => value.toString());
  const relationshipFilters = filters.filter((key) => validEntries.includes(key));

  return relationshipFilters.includes(group.affiliation);
};

/**
 * Check if any guest in group is invited to event and that the response
 * value exists within the filter map.
 */
const groupMatchesRsvp = (group: Group, rsvpFilters?: RsvpFilter): boolean => {
  if (
    !rsvpFilters ||
    Object.values(rsvpFilters).every((filters) => filters.length === 0)
  ) {
    return true;
  }

  return group.guests.some((guest) =>
    guest.event_responses.some((response) =>
      rsvpFilters?.[response.eventId]?.includes(response.rsvp)
    )
  );
};

const guestsMatchEvent = (group: Group, filters: string[]): boolean => {
  return group.guests.some((guest) =>
    guest.event_responses.some((response) => filters.includes(response.eventId))
  );
};

const guestsContainQuery = (guests: Guest[], query: string): boolean => {
  return guests.some((guest) => {
    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
    const guestNameMatches = fullName.includes(query.toLowerCase());

    if (guestNameMatches) {
      return true;
    }

    return Object.keys(guest)
      .filter(isGuestFilterableKey)
      .some((key) => guest[key].toLowerCase().includes(query));
  });
};

const isGroupFilterableKey = (
  key: GroupFilterableKey | string
): key is GroupFilterableKey => {
  const validKeys = ["email", "address1", "address2", "city", "state"];
  return validKeys.includes(key);
};

const isGuestFilterableKey = (
  key: GuestFilterableKey | string
): key is GuestFilterableKey => {
  const validKeys = ["firstName", "lastName"];
  return validKeys.includes(key);
};

const sortGroups = (groups: Group[], isReversed: boolean) => {
  return groups.sort((a, b) => {
    const bGuestNames = b.guests.map(guestToString).join(",");
    const aGuestNames = a.guests.map(guestToString).join(",");

    return isReversed
      ? bGuestNames.localeCompare(aGuestNames)
      : aGuestNames.localeCompare(bGuestNames);
  });
};

const guestToString = (guest: Guest) => {
  return `${guest.firstName} ${guest.lastName}`;
};

export { filterGroups, sortGroups };

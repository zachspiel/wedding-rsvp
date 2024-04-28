import { Group, Guest, GuestAffiliation, RsvpResponse } from "@spiel-wedding/types/Guest";

type GroupFilterableKey = "email" | "address1" | "address2" | "city" | "state";

type GuestFilterableKey = "firstName" | "lastName" | "title" | "rsvp";

const filterGroups = (groups: Group[], search: string, filters: string[]): Group[] => {
  const query = search.toLowerCase().trim();

  if (query.length === 0 && filters.length === 0) {
    return groups;
  }

  return groups.filter((group) => {
    const containsQuery =
      guestsContainQuery(group.guests, query) || groupContainsQuery(group, query);

    return containsQuery && doesGroupMatchFilter(group, filters);
  });
};

const groupContainsQuery = (group: Group, query: string): boolean => {
  return Object.keys(group)
    .filter(isGroupFilterableKey)
    .some((key) => group[key].toLowerCase().includes(query));
};

const doesGroupMatchFilter = (group: Group, filters: string[]) => {
  return (
    isGroupMissingValue(group, filters) ||
    groupMatchesAffiliation(group, filters) ||
    groupMatchesRsvp(group, filters)
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

const groupMatchesRsvp = (group: Group, filters: string[]): boolean => {
  const { ACCEPTED, DECLINED, NO_RESPONSE } = RsvpResponse;
  const rsvpFilters = filters.filter((key) => {
    return key === ACCEPTED || key === DECLINED || key === NO_RESPONSE;
  });

  if (rsvpFilters.length === 0) {
    return true;
  }

  return group.guests.some((guest) => rsvpFilters.includes(guest.rsvp));
};

const guestsContainQuery = (guests: Guest[], query: string): boolean => {
  return guests.some(
    (guest) =>
      Object.keys(guest)
        .filter(isGuestFilterableKey)
        .some((key) => guest[key].toLowerCase().includes(query)) ||
      `${guest.firstName.toLowerCase()} ${guest.lastName.toLowerCase()}`.includes(query),
  );
};

const isGroupFilterableKey = (
  key: GroupFilterableKey | string,
): key is GroupFilterableKey => {
  const validKeys = ["email", "address1", "address2", "city", "state"];
  return validKeys.includes(key);
};

const isGuestFilterableKey = (
  key: GuestFilterableKey | string,
): key is GuestFilterableKey => {
  const validKeys = ["firstName", "lastName", "rsvp"];
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

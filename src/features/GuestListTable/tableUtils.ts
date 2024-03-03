import { Group, Guest, GuestAffiliation } from "@spiel-wedding/types/Guest";

type GroupFilterableKey =
  | "email"
  | "phone"
  | "address1"
  | "address2"
  | "city"
  | "state";

type GuestFilterableKey = "firstName" | "lastName" | "title";

const filterGroups = (
  groups: Group[],
  search: string,
  filters: string[],
): Group[] => {
  const query = search.toLowerCase().trim();
  return groups.filter((group) => {
    const containsQuery =
      guestsContainQuery(group.guests, query) ||
      groupContainsQuery(group, query);
    const containsFilter =
      isGroupMissingValue(group, filters) ||
      groupMatchesAffiliation(group, filters);

    return (
      (query.length > 0 ? containsQuery : true) &&
      (filters.length > 0 ? containsFilter : true)
    );
  });
};

const groupContainsQuery = (group: Group, query: string): boolean => {
  return Object.keys(group)
    .filter(isGroupFilterableKey)
    .some((key) => group[key].toLowerCase().includes(query));
};

const isGroupMissingValue = (group: Group, filters: string[]): boolean => {
  const validEntries = ["email", "phone", "address1"];
  const missingValueFilters = filters.filter((filter) =>
    validEntries.includes(filter),
  );

  return Object.keys(group)
    .filter(isGroupFilterableKey)
    .filter((key) => missingValueFilters.includes(key))
    .some((key) => group[key].trim().length === 0);
};

const groupMatchesAffiliation = (group: Group, filters: string[]): boolean => {
  const validEntries = Object.values(GuestAffiliation).map((value) =>
    value.toString(),
  );
  const relationshipFilters = filters.filter((key) =>
    validEntries.includes(key),
  );

  return relationshipFilters.includes(group.affiliation);
};

const guestsContainQuery = (guests: Guest[], query: string): boolean => {
  return guests.some(
    (guest) =>
      Object.keys(guest)
        .filter(isGuestFilterableKey)
        .some((key) => guest[key].toLowerCase().includes(query)) ||
      `${guest.firstName.toLowerCase()} ${guest.lastName.toLowerCase()}`.includes(
        query,
      ),
  );
};

const isGroupFilterableKey = (
  key: GroupFilterableKey | string,
): key is GroupFilterableKey => {
  const validKeys = ["email", "phone", "address1", "address2", "city", "state"];
  return validKeys.includes(key);
};

const isGuestFilterableKey = (
  key: GuestFilterableKey | string,
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

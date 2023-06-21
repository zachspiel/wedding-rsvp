import { GuestAffiliation, Group } from "@spiel-wedding/types/Guest";

export type FilterableKeys = "email" | "phone" | "address1";

const getUniqueAffiliations = (groups: Group[]): GuestAffiliation[] => {
  return Array.from(new Set(groups.map((group) => group.affiliation)).values());
};

const filterGroupByAffiliation = (
  affiliation: GuestAffiliation,
  groups: Group[],
): number => {
  return groups.filter((group) => group.affiliation === affiliation).length;
};

const filterGroupByProperty = (property: FilterableKeys, groups: Group[]): number => {
  return groups.filter((group) => group[property].length === 0).length;
};

const getMissingValueTotals = (groups: Group[]): Record<string, number> => {
  return {
    email: filterGroupByProperty("email", groups),
    phone: filterGroupByProperty("phone", groups),
    address1: filterGroupByProperty("address1", groups),
  };
};

export {
  getUniqueAffiliations,
  filterGroupByAffiliation,
  filterGroupByProperty,
  getMissingValueTotals,
};

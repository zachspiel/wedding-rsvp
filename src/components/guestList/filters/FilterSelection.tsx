"use client";
import React from "react";
import { MultiSelect, SelectItem } from "@mantine/core";
import { Group, GuestAffiliation } from "../../../../types/Guest";
import {
  filterGroupByAffiliation,
  getMissingValueTotals,
  getUniqueAffiliations,
} from "./filterUtils";

interface Props {
  groups: Group[];
  filters: string[];
  setFilters: (filters: string[]) => void;
}

const FilterSelection = (props: Props): JSX.Element => {
  const { groups, filters, setFilters } = props;
  const [selectItems, setSelectItems] = React.useState<SelectItem[]>([]);
  const totalGuests = React.useMemo(
    () =>
      groups
        .map((group) => group.guests.length)
        .reduce((total, current) => total + current, 0),
    [groups]
  );

  React.useEffect(() => {
    const missingValueTotals = getMissingValueTotals(groups);
    const newSelectItems: SelectItem[] = [];

    for (const [key, value] of Object.entries(missingValueTotals)) {
      if (value > 0) {
        newSelectItems.push(createMissingValueItem(key, `${key} (${value})`));
      }
    }

    const affiliations = getUniqueAffiliations(groups).map(mapAffiliationToSelectItem);
    newSelectItems.push(...affiliations);

    setSelectItems(newSelectItems);
  }, [groups]);

  const createMissingValueItem = (value: string, label: string): SelectItem => {
    return { value: value, label: `Missing ${label}`, group: "BY MISSING INFORMATION" };
  };

  const mapAffiliationToSelectItem = (affiliation: GuestAffiliation): SelectItem => {
    const totalGroups = filterGroupByAffiliation(affiliation, groups);
    const group = "BY RELATIONSHIP TO YOU";
    const label = affiliation === GuestAffiliation.NONE ? "Unknown" : affiliation;

    return {
      value: affiliation,
      label: `${label} (${totalGroups})`,
      group,
    };
  };

  return (
    <MultiSelect
      w="50%"
      data={selectItems}
      placeholder={`Filter Guests (${totalGuests})`}
      value={filters}
      onChange={setFilters}
    />
  );
};

export default FilterSelection;

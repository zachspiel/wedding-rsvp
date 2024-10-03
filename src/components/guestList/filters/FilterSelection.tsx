"use client";

import { ComboboxItem, ComboboxItemGroup, MultiSelect } from "@mantine/core";
import { Event, Group, GuestAffiliation } from "@spiel-wedding/types/Guest";
import React from "react";
import {
  filterGroupByAffiliation,
  getMissingValueTotals,
  getUniqueAffiliations,
} from "./filterUtils";

interface Props {
  groups: Group[];
  events: Event[];
  filters: string[];
  setFilters: (filters: string[]) => void;
}

const FilterSelection = (props: Props): JSX.Element => {
  const { groups, filters, setFilters } = props;
  const [selectItems, setSelectItems] = React.useState<ComboboxItemGroup[]>([]);
  const totalGuests = React.useMemo(
    () =>
      groups
        .map((group) => group.guests.length)
        .reduce((total, current) => total + current, 0),
    [groups]
  );

  React.useEffect(() => {
    const missingValueTotals = getMissingValueTotals(groups);
    const newSelectItems: ComboboxItemGroup[] = [];

    const missingItemOptions = Object.entries(missingValueTotals)
      .filter(([key, value]) => value > 0)
      .map(([key, value]) => ({
        value: key,
        label: `${key} (${value})`,
      }));

    if (missingItemOptions.length > 0) {
      newSelectItems.push({
        group: "BY MISSING INFORMATION",
        items: missingItemOptions,
      });
    }

    const affiliations = getUniqueAffiliations(groups).map(mapAffiliationToSelectItem);
    newSelectItems.push({
      group: "BY RELATIONSHIP TO YOU",
      items: affiliations,
    });

    setSelectItems(newSelectItems);
  }, [groups]);

  const mapAffiliationToSelectItem = (affiliation: GuestAffiliation): ComboboxItem => {
    const totalGroups = filterGroupByAffiliation(affiliation, groups);

    return { value: affiliation, label: `${affiliation} (${totalGroups})` };
  };

  return (
    <MultiSelect
      w={{ base: "100%", md: "25%" }}
      data={selectItems}
      placeholder={`Filter Guests (${totalGuests})`}
      value={filters}
      onChange={setFilters}
    />
  );
};

export default FilterSelection;

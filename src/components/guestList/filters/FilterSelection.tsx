"use client";

import { ComboboxItem, ComboboxItemGroup, MultiSelect } from "@mantine/core";
import { Event, Group, GuestAffiliation, RsvpResponse } from "@spiel-wedding/types/Guest";
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

    newSelectItems.push({
      group: "RSVP STATUS",
      items: [RsvpResponse.ACCEPTED, RsvpResponse.DECLINED, RsvpResponse.NO_RESPONSE],
    });

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

    newSelectItems.push({
      group: "BY EVENT",
      items: props.events.map((event) => ({
        value: event.event_id,
        label: `${event.title} ${event.emoji}`,
      })),
    });

    setSelectItems(newSelectItems);
  }, [groups]);

  const mapAffiliationToSelectItem = (affiliation: GuestAffiliation): ComboboxItem => {
    const totalGroups = filterGroupByAffiliation(affiliation, groups);

    return { value: affiliation, label: `${affiliation} (${totalGroups})` };
  };

  return (
    <MultiSelect
      w="50%"
      mb="md"
      data={selectItems}
      placeholder={`Filter Guests (${totalGuests})`}
      value={filters}
      onChange={setFilters}
    />
  );
};

export default FilterSelection;

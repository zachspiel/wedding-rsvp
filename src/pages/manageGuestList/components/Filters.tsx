import React from "react";
import { MultiSelect, SelectItem, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Group, GuestAffiliation } from "../../../types/Guest";

interface Props {
  groups: Group[];
}

type FilterableKeys = "email" | "phone" | "address1";

const Filters = (props: Props): JSX.Element => {
  const { groups } = props;

  const filterGroupByProperty = (property: FilterableKeys): number => {
    return groups.filter((group) => group[property].length === 0).length;
  };

  const filterGroupByAffiliation = (affiliation: GuestAffiliation): number => {
    return groups.filter((group) => group.affiliation === affiliation).length;
  };

  const getUniqueAffiliations = (): GuestAffiliation[] => {
    return groups
      .map((group) => group.affiliation)
      .filter((affiliation, i, all) => all.indexOf(affiliation) === i);
  };

  const groupGuestLengths = groups
    .filter((group) => group.invited)
    .map((group) => group.guests.length);

  const totalGuests = groups
    .map((group) => group.guests.length)
    .reduce((total, current) => total + current, 0);

  const totalInvited =
    groupGuestLengths.length > 0
      ? groupGuestLengths.reduce((total, current) => total + current)
      : 0;

  const totalMissingEmail = filterGroupByProperty("email");
  const totalMissingPhone = filterGroupByProperty("phone");
  const totalMissingAddress = filterGroupByProperty("address1");
  const uniqueAffiliations = getUniqueAffiliations();

  const mapAffiliationToSelectItem = (
    affiliation: GuestAffiliation
  ): SelectItem => {
    const total = filterGroupByAffiliation(affiliation);
    const group = "BY RELATIONSHIP TO YOU";
    const label =
      affiliation === GuestAffiliation.NONE ? "Unknown" : affiliation;

    return { value: affiliation, label: `${label} (${total})`, group };
  };

  const getSelectItems = (): SelectItem[] => {
    const selectItems: SelectItem[] = [];

    if (totalInvited > 0) {
      selectItems.push({
        value: "invited",
        label: `Definitely Invited (${totalInvited})`,
        group: "BY INVITED STATUS",
      });
    }

    if (totalMissingEmail > 0) {
      selectItems.push({
        value: "missing-email",
        label: `Missing Email (${totalMissingEmail})`,
        group: "BY MISSING INFORMATION",
      });
    }

    if (totalMissingPhone > 0) {
      selectItems.push({
        value: "missing-phone",
        label: `Missing Phone (${totalMissingPhone})`,
        group: "BY MISSING INFORMATION",
      });
    }

    if (totalMissingAddress > 0) {
      selectItems.push({
        value: "missing-address",
        label: `Missing Address (${totalMissingAddress})`,
        group: "BY MISSING INFORMATION",
      });
    }

    selectItems.push(...uniqueAffiliations.map(mapAffiliationToSelectItem));
    return selectItems;
  };

  return (
    <>
      <MultiSelect
        data={getSelectItems()}
        placeholder={`Filter Guests (${totalGuests})`}
      ></MultiSelect>
      <TextInput
        placeholder="Search Guest List"
        icon={<IconSearch size="0.8rem" />}
      />
    </>
  );
};

export default Filters;

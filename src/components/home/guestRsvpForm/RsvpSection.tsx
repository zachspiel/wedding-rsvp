"use client";

import { Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import Searchbar from "./components/Searchbar";
import { guestMatchesSearch } from "./util";
import SearchResultRow from "./components/SearchResultRow";
import RsvpForm from "./RsvpForm";
import { useState } from "react";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import { getGroups, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";

const RsvpSection = (): JSX.Element => {
  const { data: groups } = useSWR(GROUP_SWR_KEY, getGroups);
  const [error, setError] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [searchResults, setSearchResults] = useState<Group[]>([]);

  const getSearchResults = (firstName: string, lastName: string): void => {
    setSelectedGroup(undefined);
    setSearchResults([]);

    const filteredResults =
      groups?.filter(
        (group) =>
          group.guests.filter((guest) =>
            guestMatchesSearch(firstName, lastName, guest),
          ).length > 0,
      ) ?? [];

    if (filteredResults.length === 0) {
      setError(
        `Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.`,
      );
    } else {
      setError(undefined);
    }

    setSearchResults(filteredResults);
  };

  return (
    <SectionContainer>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        {`Please enter the first and last name of one member of your party below. If
                you're responding for you and a guest (or your family), you'll be able to
                RSVP for your entire group on the next page.`}
      </Text>

      <Searchbar getSearchResults={getSearchResults} />

      {selectedGroup === undefined && searchResults.length > 0 && (
        <Text>Select your info below or try searching again.</Text>
      )}

      {error !== undefined && (
        <Text c="red" fz="sm">
          {error}
        </Text>
      )}

      {selectedGroup === undefined &&
        searchResults.map((group, index) => (
          <SearchResultRow
            key={`${group.id}-${index}`}
            group={group}
            displayBottomDivider={index === searchResults.length - 1}
            onSelect={(): void => setSelectedGroup(group)}
          />
        ))}

      {selectedGroup !== undefined && (
        <RsvpForm selectedGroup={selectedGroup} />
      )}
    </SectionContainer>
  );
};

export default RsvpSection;

"use client";

import { Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import Searchbar from "./components/Searchbar";
import { guestMatchesSearch } from "./util";
import { ref, onValue } from "firebase/database";
import { analytics, database } from "@spiel-wedding/database/database";
import SearchResultRow from "./components/SearchResultRow";
import RsvpForm from "./RsvpForm";
import { logEvent } from "firebase/analytics";
import { useState, useEffect } from "react";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";

const RsvpSection = (): JSX.Element => {
  const [error, setError] = useState<string>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [searchResults, setSearchResults] = useState<Group[]>([]);

  useEffect(() => {
    const guestsRef = ref(database, "groups/");
    onValue(guestsRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      const groupData = Object.values(data) as Group[];
      setGroups(groupData);
    });
  }, []);

  const getSearchResults = (firstName: string, lastName: string): void => {
    setSelectedGroup(undefined);
    setSearchResults([]);

    const filteredResults = groups.filter(
      (group) =>
        group.guests.filter((guest) => guestMatchesSearch(firstName, lastName, guest))
          .length > 0,
    );

    if (filteredResults.length === 0) {
      setError(
        `Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.`,
      );
    } else {
      setError(undefined);
    }

    if (analytics) {
      logEvent(analytics, "rsvp_form_search", {
        searchValue: { firstName, lastName },
        totalResults: filteredResults.length,
      });
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
        <Text color="red" fz="sm">
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

      {selectedGroup !== undefined && <RsvpForm selectedGroup={selectedGroup} />}
    </SectionContainer>
  );
};

export default RsvpSection;

"use client";

import { Skeleton, Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import Searchbar from "./components/Searchbar";
import SearchResultRow from "./components/SearchResultRow";
import RsvpForm from "./RsvpForm";
import { useState } from "react";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";

const getMatchingGuests = async (
  firstName: string,
  lastName: string
): Promise<Group[]> => {
  const result = await fetch(
    `/api/searchResult?firstName=${firstName}&lastName=${lastName}`
  ).then((res) => res.json());

  if (result.length === 0) {
    const error = {
      info: `Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.`,
      status: 400,
    };
    throw error;
  }

  return result;
};

interface SearchForm {
  firstName: string;
  lastName: string;
}

const RsvpSection = (): JSX.Element => {
  const [searchForm, setSearchForm] = useState<SearchForm>();
  const { data, error, isLoading } = useSWR(
    searchForm ? ["searchResults", searchForm] : null,
    ([url, params]) => getMatchingGuests(params.firstName, params.lastName)
  );

  const [selectedGroup, setSelectedGroup] = useState<Group>();

  const getSearchResults = (firstName: string, lastName: string): void => {
    setSearchForm({ firstName, lastName });
  };

  console.log(data);
  return (
    <SectionContainer>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        {`Please enter the first and last name of one member of your party below. If
                you're responding for you and a guest (or your family), you'll be able to
                RSVP for your entire group on the next page.`}
      </Text>

      <Searchbar getSearchResults={getSearchResults} />

      {selectedGroup === undefined && (data ?? []).length > 0 && (
        <Text>Select your info below or try searching again.</Text>
      )}

      {error !== undefined && (
        <Text c="red" fz="sm">
          {error.info}
        </Text>
      )}

      {selectedGroup === undefined &&
        data &&
        data?.map((group, index) => (
          <SearchResultRow
            key={`${group.id}-${index}`}
            group={group}
            displayBottomDivider={index === data?.length - 1}
            onSelect={(): void => setSelectedGroup(group)}
          />
        ))}

      {selectedGroup !== undefined && <RsvpForm selectedGroup={selectedGroup} />}

      {isLoading && (
        <>
          <Skeleton w="100%" h={25} />

          <Skeleton w="100%" h={25} my="md" />

          <Skeleton w="100%" h={25} />
        </>
      )}
    </SectionContainer>
  );
};

export default RsvpSection;

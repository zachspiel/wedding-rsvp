import React from "react";
import SectionTitle from "../../../components/common/SectionTitle";
import { Text } from "@mantine/core";
import { Group } from "../../../types/Guest";
import Searchbar from "./components/Searchbar";
import { guestMatchesSearch } from "./util";
import { ref, onValue } from "firebase/database";
import { database } from "../../../database/database";
import SearchResultRow from "./components/SearchResultRow";
import RsvpForm from "./RsvpForm";

const RsvpSection = (): JSX.Element => {
  const [error, setError] = React.useState<string>();
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<Group>();
  const [searchResults, setSearchResults] = React.useState<Group[]>([]);

  React.useEffect(() => {
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
        "Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.",
      );
    } else {
      setError(undefined);
    }

    // logEvent(analytics, "rsvp_form_search", {
    //   searchValue: { firstName, lastName },
    //   totalResults: filteredResults.length,
    // });

    setSearchResults(filteredResults);
  };

  return (
    <>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        {`Please enter the first and last name of one member of your party below. If
                you're responding for you and a guest (or your family), you'll be able to
                RSVP for your entire group on the next page.`}
      </Text>

      <Searchbar hasError={error !== undefined} getSearchResults={getSearchResults} />

      {selectedGroup === undefined && searchResults.length > 0 && (
        <Text>Select your info below or try searching again.</Text>
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
    </>
  );
};

export default RsvpSection;

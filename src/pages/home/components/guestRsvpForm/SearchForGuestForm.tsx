import React from "react";
import { Button, Divider, Flex, Group as MGroup, Text, TextInput } from "@mantine/core";
import { Group, Guest } from "../../../../types/Guest";
import { onValue, ref } from "firebase/database";
import { database } from "../../../../database/database";
import RsvpForm from "./GuestRsvpForm";

const guestMatchesSearch = (searchValue: string, guest: Guest): boolean => {
  const firstName = searchValue.split(" ")?.[0]?.toLowerCase() ?? "";
  const lastName = searchValue.split(" ")?.[1]?.toLowerCase() ?? "";
  const guestFirstName = guest.firstName.toLowerCase();
  const guestLastName = guest.lastName.toLowerCase();

  if (firstName.length === 0 || lastName.length === 0) {
    return false;
  }

  return guestFirstName.includes(firstName) || guestLastName.includes(lastName);
};

const SearchForGuest = (): JSX.Element => {
  const [searchValue, setSearchValue] = React.useState("");
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

  const getSearchResults = (): void => {
    const filteredResults = groups.filter(
      (group) =>
        group.guests.filter((guest) => guestMatchesSearch(searchValue, guest)).length > 0,
    );

    if (filteredResults.length === 0) {
      setError(
        "Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.",
      );
    } else {
      setError(undefined);
    }

    setSearchResults(filteredResults);
  };

  return (
    <>
      <MGroup pb="lg">
        <TextInput
          value={searchValue}
          onChange={(e): void => setSearchValue(e.currentTarget.value)}
          error={error}
          required
          placeholder="First and Last name"
          description="Ex. Zachary Spielberger (not The Spielberger Family or Dr. & Mr. Spielberger)"
        />
        <Button mt={error ? 0 : "lg"} onClick={getSearchResults}>
          Continue
        </Button>
      </MGroup>
      {searchResults.length > 0 && (
        <Text>Select your info below or try searching again.</Text>
      )}
      {selectedGroup === undefined &&
        searchResults.map((group, index) => (
          <>
            <Divider my="sm" key={`divider-${index}`} />
            <MGroup position="apart" key={`group-${index}`}>
              <Flex direction="column">
                {group.guests.map((guest, guestIndex) => (
                  <Text key={`group-${index}-guest-${guestIndex}`}>
                    {guest.firstName} {guest.lastName}
                  </Text>
                ))}
              </Flex>
              <Button onClick={(): void => setSelectedGroup(group)}>Select</Button>
            </MGroup>
            {index === Object.keys(searchResults).length - 1 && (
              <Divider my="sm" key={`divider-bottom-${index}`} />
            )}
          </>
        ))}
      {selectedGroup !== undefined && <RsvpForm selectedGroup={selectedGroup} />}
    </>
  );
};

export default SearchForGuest;

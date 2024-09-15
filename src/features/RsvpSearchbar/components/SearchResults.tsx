"use client";

import { Button, Divider, Flex, Group as MGroup, Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";

interface Props {
  searchResults: Group[];
  setSelectedGroup: (group: Group) => void;
}

const SearchResults = ({ searchResults, setSelectedGroup }: Props) => {
  return (
    <>
      {searchResults.map((group, index) => {
        const displayBottomDivider = index === searchResults.length - 1;

        return (
          <Flex direction="column" key={group.group_id}>
            <Divider my="sm" />
            <MGroup justify="space-between">
              <Flex direction="column">
                {group.guests.map((guest, guestIndex) => (
                  <Text key={`group-${group.group_id}-guest-${guestIndex}`}>
                    {guest.nameUnknown && "Guest name unknown"}
                    {guest.firstName} {guest.lastName}
                  </Text>
                ))}
              </Flex>
              <Button onClick={() => setSelectedGroup(group)}>Select</Button>
            </MGroup>
            {displayBottomDivider && <Divider my="sm" />}
          </Flex>
        );
      })}
    </>
  );
};

export default SearchResults;

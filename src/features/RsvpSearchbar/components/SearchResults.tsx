import { Flex, Group as MGroup, Divider, Button, Text } from "@mantine/core";
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
        const isModifyingRsvp = group.rsvpModifications !== null;

        return (
          <Flex direction="column" key={group.id}>
            <Divider my="sm" />
            <MGroup justify="space-between">
              <Flex direction="column">
                {group.guests.map((guest, guestIndex) => (
                  <Text key={`group-${group.id}-guest-${guestIndex}`}>
                    {guest.nameUnknown && "Guest name unknown"}
                    {guest.firstName} {guest.lastName}
                  </Text>
                ))}
              </Flex>
              <Button
                className="primaryButton"
                onClick={(): void => {
                  setSelectedGroup(group);
                }}
              >
                {isModifyingRsvp ? "Edit RSVP" : "Select"}
              </Button>
            </MGroup>
            {displayBottomDivider && <Divider my="sm" />}
          </Flex>
        );
      })}
    </>
  );
};

export default SearchResults;

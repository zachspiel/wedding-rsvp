import { Group } from "@spiel-wedding/types/Guest";
import { Flex, Group as MGroup, Divider, Button, Text } from "@mantine/core";

interface Props {
  group: Group;
  displayBottomDivider: boolean;
  onSelect: () => void;
}

const SearchResultRow = (props: Props): JSX.Element => {
  const { group, displayBottomDivider } = props;
  const isModifyingRsvp = group.rsvpModifications !== undefined;

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
          onClick={(): void => {
            props.onSelect();
          }}
        >
          {isModifyingRsvp ? "Edit RSVP" : "Select"}
        </Button>
      </MGroup>
      {displayBottomDivider && <Divider my="sm" />}
    </Flex>
  );
};

export default SearchResultRow;

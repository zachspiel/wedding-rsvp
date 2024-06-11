import { Badge, Text } from "@mantine/core";
import { Guest, GuestAffiliation } from "@spiel-wedding/types/Guest";

interface Props {
  guests: Guest[];
  affiliation?: GuestAffiliation;
}

const GuestsColumn = (props: Props): JSX.Element => {
  const { guests, affiliation } = props;

  return (
    <>
      {guests.map((guest, index) => (
        <Text
          key={`${guest.guest_id}-guest-name`}
          ml={index > 0 ? "xl" : ""}
          style={{ display: "flex" }}
        >
          {guest.nameUnknown && "Guest"}
          {guest.firstName} {guest.lastName}
        </Text>
      ))}
      {affiliation !== GuestAffiliation.NONE && (
        <Badge size="xs" fz="xs" style={{ textTransform: "capitalize" }}>
          {affiliation}
        </Badge>
      )}
    </>
  );
};

export default GuestsColumn;

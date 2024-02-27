import { Text } from "@mantine/core";
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
          key={`${guest.id}-guest-name`}
          ml={index > 0 ? "xl" : ""}
          style={{ display: "flex" }}
        >
          {guest.nameUnknown && "Guest"}
          {guest.firstName} {guest.lastName}
        </Text>
      ))}
      {affiliation !== GuestAffiliation.NONE && (
        <Text fs="italic" ml="xl">
          {affiliation}
        </Text>
      )}
    </>
  );
};

export default GuestsColumn;

import React from "react";
import { List, Text } from "@mantine/core";
import { Guest, GuestAffiliation } from "../../../../types/Guest";

interface Props {
  guests: Guest[];
  affiliation?: GuestAffiliation;
}

const GuestsColumn = (props: Props): JSX.Element => {
  const { guests, affiliation } = props;
  const secondaryGuests = guests.slice(1);
  const listItems = secondaryGuests.map((guest, index) => (
    <List.Item key={index}>
      {guest.firstName} {guest.lastName}
    </List.Item>
  ));

  return (
    <List listStyleType="none" withPadding>
      <List.Item>
        {guests[0].firstName} {guests[0].lastName}
        <List withPadding listStyleType="none">
          {listItems}
          {affiliation !== GuestAffiliation.NONE && (
            <List.Item>
              <Text fs="italic">{affiliation}</Text>
            </List.Item>
          )}
        </List>
      </List.Item>
    </List>
  );
};

export default GuestsColumn;

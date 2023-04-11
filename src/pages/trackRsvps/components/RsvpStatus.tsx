import React from "react";
import { List } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import { Guest, RsvpResonse } from "../../../types/Guest";

interface Props {
  guests: Guest[];
}

const RsvpStatus = (props: Props): JSX.Element => {
  const { guests } = props;
  const secondaryGuests = guests.slice(1);
  const listItems = secondaryGuests.map((guest, index) => (
    <List.Item key={index}>
      {guest.firstName} {guest.lastName}
    </List.Item>
  ));

  return (
    <List listStyleType="none" withPadding>
      {guests.map((guest) => (
        <List.Item key={`${guest.firstName}-${guest.lastName}`}>
          {guest.rsvp === RsvpResonse.ACCEPTED && <IconCheck color="green" />}
          {guest.rsvp !== RsvpResonse.ACCEPTED && <IconX color="red" />}
        </List.Item>
      ))}
    </List>
  );
};

export default RsvpStatus;

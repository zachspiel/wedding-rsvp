import React from "react";
import { List } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import { Guest, RsvpResonse } from "../../../../../types/Guest";

interface Props {
  guests: Guest[];
}

const RsvpStatusColumn = (props: Props): JSX.Element => {
  const { guests } = props;

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

export default RsvpStatusColumn;

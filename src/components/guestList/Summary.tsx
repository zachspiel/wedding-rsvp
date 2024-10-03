"use client";

import { Group as MGroup, Text } from "@mantine/core";
import { Event, Group, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";
import { useMemo } from "react";

interface Props {
  groups: Group[];
  event: Event;
}

const Summary = ({ groups, event }: Props): JSX.Element => {
  const groupGuestLengths = groups.map(
    (group) => getGuestsForEvent(event, group.guests).length
  );

  const totalInvited = useMemo(() => {
    if (groupGuestLengths.length > 0) {
      return groupGuestLengths.reduce((total, current) => total + current);
    }
    return 0;
  }, [groupGuestLengths]);

  const getRsvpStatusForEvent = (guest: Guest) => {
    if (!event) {
      return undefined;
    }

    return guest.responseMap[event.event_id]?.rsvp;
  };

  const totalAccepted = groups
    .flatMap((group) => group.guests)
    .filter((guest) => getRsvpStatusForEvent(guest) === RsvpResponse.ACCEPTED).length;

  const totalDeclined = groups
    .flatMap((group) => group.guests)
    .filter((guest) => getRsvpStatusForEvent(guest) === RsvpResponse.DECLINED).length;

  const totalMissingResponse = totalInvited - totalAccepted - totalDeclined;

  const createSummaryItem = (
    title: string,
    total: number,
    color: string
  ): JSX.Element => {
    return (
      <div>
        <Text ta="center" fw="bold">
          {total}
        </Text>
        <Text c={color} style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          {title}
        </Text>
      </div>
    );
  };

  return (
    <MGroup mt="sm" style={{ overflow: "auto" }} wrap="nowrap">
      {createSummaryItem("Invited", totalInvited, "")}
      {createSummaryItem("Coming", totalAccepted, "green.6")}
      {createSummaryItem("Declined", totalDeclined, "red.6")}
      {createSummaryItem("No Response", totalMissingResponse, "yellow.6")}
    </MGroup>
  );
};

export default Summary;

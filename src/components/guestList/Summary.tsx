import { Flex, Group as MGroup, Text, Title } from "@mantine/core";
import { Event, Group, Guest, RsvpResponse } from "@spiel-wedding/types/Guest";
import { useMemo } from "react";

interface Props {
  groups: Group[];
  ceremonyEvent?: Event;
}

const Summary = ({ groups, ceremonyEvent }: Props): JSX.Element => {
  const groupGuestLengths = groups
    .filter((group) => group.invited)
    .map((group) => group.guests.length);

  const totalInvited = useMemo(() => {
    if (groupGuestLengths.length > 0) {
      return groupGuestLengths.reduce((total, current) => total + current);
    }
    return 0;
  }, [groupGuestLengths]);

  const getRsvpStatusForCeremony = (guest: Guest) => {
    return guest.event_responses.find(
      (response) => response.eventId === ceremonyEvent?.event_id
    )?.rsvp;
  };

  const totalAccepted = groups
    .flatMap((group) => group.guests)
    .filter((guest) => getRsvpStatusForCeremony(guest) === RsvpResponse.ACCEPTED).length;

  const totalDeclined = groups
    .flatMap((group) => group.guests)
    .filter((guest) => getRsvpStatusForCeremony(guest) === RsvpResponse.DECLINED).length;

  const totalMissingResponse = totalInvited - totalAccepted - totalDeclined;

  const createSummaryItem = (title: string, total: number): JSX.Element => {
    return (
      <Flex direction="column">
        <Title order={3} style={{ textAlign: "center" }}>
          {total}
        </Title>
        <Text style={{ textAlign: "center" }}>{title}</Text>
      </Flex>
    );
  };

  return (
    <MGroup align="apart" grow pb="xl" pt="xl">
      {createSummaryItem("Definitely Invited", totalInvited)}
      {createSummaryItem("Coming to Ceremony", totalAccepted)}
      {createSummaryItem("Declined", totalDeclined)}
      {createSummaryItem("No Response", totalMissingResponse)}
    </MGroup>
  );
};

export default Summary;

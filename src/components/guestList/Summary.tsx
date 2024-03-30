import { Flex, Group as MGroup, Text, Title } from "@mantine/core";
import { Group, RelationshipType, RsvpResponse } from "@spiel-wedding/types/Guest";
import { useMemo } from "react";

interface Props {
  groups: Group[];
}

const { CHILD } = RelationshipType;

const Summary = ({ groups }: Props): JSX.Element => {
  const groupGuestLengths = groups
    .filter((group) => group.invited)
    .map((group) => group.guests.length);

  const totalInvited = useMemo(() => {
    if (groupGuestLengths.length > 0) {
      return groupGuestLengths.reduce((total, current) => total + current);
    }
    return 0;
  }, [groupGuestLengths]);

  const totalAccepted = groups
    .flatMap((group) => group.guests)
    .filter((guest) => guest.rsvp === RsvpResponse.ACCEPTED).length;

  const totalDeclined = groups
    .flatMap((group) => group.guests)
    .filter((guest) => guest.rsvp === RsvpResponse.DECLINED).length;

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
      {createSummaryItem("Accepted", totalAccepted)}
      {createSummaryItem("Declined", totalDeclined)}
      {createSummaryItem("No Response", totalMissingResponse)}
    </MGroup>
  );
};

export default Summary;

import { Flex, Group as MGroup, Text, Title } from "@mantine/core";
import { RelationshipType, Group } from "@spiel-wedding/types/Guest";
import { useMemo } from "react";

interface Props {
  groups: Group[];
}

const { CHILD } = RelationshipType;

const Summary = ({ groups }: Props): JSX.Element => {
  const allGuests = useMemo(() => groups.flatMap((group) => group.guests), [groups]);
  const groupGuestLengths = useMemo(
    () => groups.filter((group) => group.invited).map((group) => group.guests.length),
    [groups]
  );

  const totalInvited = useMemo(() => {
    if (groupGuestLengths.length > 0) {
      return groupGuestLengths.reduce((total, current) => total + current);
    }
    return 0;
  }, [groupGuestLengths]);

  const totalAdults = useMemo(
    () => allGuests.filter((guest) => guest.relationshipType !== CHILD).length,
    [allGuests]
  );

  const totalChildren = useMemo(
    () => allGuests.filter((guest) => guest.relationshipType === CHILD).length,
    [allGuests]
  );

  const totalMissingAddress = useMemo(
    () => groups.filter((group) => group.address1?.length === 0).length,
    [allGuests]
  );

  const totalSaveTheDatesSent = groups.filter((group) => group.saveTheDateSent).length;

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
      {createSummaryItem("Adults", totalAdults)}
      {createSummaryItem("Children", totalChildren)}
      {createSummaryItem("Missing Addresses", totalMissingAddress)}
      {createSummaryItem("Save the Dates Sent", totalSaveTheDatesSent)}
    </MGroup>
  );
};

export default Summary;

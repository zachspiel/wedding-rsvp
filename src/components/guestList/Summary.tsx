import { Flex, Group as MGroup, Text, Title } from "@mantine/core";
import { RelationshipType, Group } from "@spiel-wedding/types/Guest";
import { useMemo } from "react";

interface Props {
  groups: Group[];
}

const { CHILD } = RelationshipType;

const Summary = (props: Props): JSX.Element => {
  const { groups } = props;

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

  const createSummaryItem = (title: string, total: number): JSX.Element => {
    return (
      <Flex direction="column">
        <Title order={3} align="center">
          {total}
        </Title>
        <Text align="center">{title}</Text>
      </Flex>
    );
  };

  return (
    <MGroup align="apart" grow pb="xl" pt="xl">
      {createSummaryItem("Definitely Invited", totalInvited)}
      {createSummaryItem("Adults", totalAdults)}
      {createSummaryItem("Children", totalChildren)}
      {createSummaryItem("Missing Addresses", totalMissingAddress)}
    </MGroup>
  );
};

export default Summary;

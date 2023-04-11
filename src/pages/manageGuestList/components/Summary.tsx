import React from "react";
import { Flex, Group as MGroup, Text, Title } from "@mantine/core";
import { RelationshipType, Group } from "../../../types/Guest";

interface Props {
  groups: Group[];
}

const Summary = (props: Props): JSX.Element => {
  const { groups } = props;
  const allGuests = groups.flatMap((group) => group.guests);
  const groupGuestLengths = groups
    .filter((group) => group.invited)
    .map((group) => group.guests.length);

  const totalInvited =
    groupGuestLengths.length > 0
      ? groupGuestLengths.reduce((total, current) => total + current)
      : 0;

  const totalAdults = allGuests.filter(
    (guest) => guest.relationshipType !== RelationshipType.CHILD
  ).length;

  const totalChildren = allGuests.filter(
    (guest) => guest.relationshipType === RelationshipType.CHILD
  ).length;

  const totalMissingAddress = groups.filter(
    (group) => group.address1?.length === 0
  ).length;

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

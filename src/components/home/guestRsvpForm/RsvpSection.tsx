"use client";

import { Alert, Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import RsvpForm from "./RsvpForm";
import { useState } from "react";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import { IconInfoCircle } from "@tabler/icons-react";
import RsvpSearchbar from "@spiel-wedding/features/RsvpSearchbar/RsvpSearchbar";

const getMatchingGuests = async (
  firstName: string,
  lastName: string
): Promise<Group[]> => {
  const result = await fetch(
    `/api/searchResult?firstName=${firstName}&lastName=${lastName}`
  ).then((res) => res.json());

  if (result.length === 0) {
    const error = {
      info: `Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.`,
      status: 400,
    };
    throw error;
  }

  return result;
};

const RsvpSection = (): JSX.Element => {
  const [selectedGroup, setSelectedGroup] = useState<Group>();

  return (
    <SectionContainer>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        Please enter the first and last name of one member of your party below. If
        you&apos;re responding for you and a guest (or your family), you&apos;ll be able
        to RSVP for your entire group on the next page.
      </Text>

      <Alert
        variant="light"
        color="teal"
        icon={<IconInfoCircle />}
        style={{ width: "fit-content" }}
      >
        Please RSVP no later than September 26th 2024.
      </Alert>

      <RsvpSearchbar selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />

      {selectedGroup !== undefined && <RsvpForm selectedGroup={selectedGroup} />}
    </SectionContainer>
  );
};

export default RsvpSection;

"use client";

import { Alert, Modal, Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import RsvpForm from "@spiel-wedding/features/RsvpForm";
import { useEffect, useState } from "react";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import { IconInfoCircle } from "@tabler/icons-react";
import RsvpSearchbar from "@spiel-wedding/features/RsvpSearchbar/RsvpSearchbar";
import { useMediaQuery } from "@mantine/hooks";

const RSVP = (): JSX.Element => {
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  useEffect(() => {
    if (!opened && selectedGroup !== undefined) {
      setSelectedGroup(undefined);
    }
  }, [opened]);

  return (
    <SectionContainer id="rsvp">
      <SectionTitle title="RSVP" />
      <Text>
        Please enter the first and last name of one member of your party below. If
        you&apos;re responding for you and a guest (or your family), you&apos;ll be able
        to RSVP for your entire group on the next page.
      </Text>

      <Text>
        We love your children, but due to space restrictions, we cannot accommodate guests
        under the age of 18 on our wedding day. The only children present will be those in
        the wedding party. Thank you for your understanding.
      </Text>

      <Text>
        Please reach out to Sedona or Zach if you have any questions about guest
        attendance.
      </Text>
      <Alert
        variant="light"
        color="teal"
        icon={<IconInfoCircle />}
        style={{ width: "fit-content" }}
      >
        Please RSVP no later than September 26th 2024.
      </Alert>

      <RsvpSearchbar
        selectedGroup={selectedGroup}
        setSelectedGroup={(group) => {
          setSelectedGroup(group);

          if (group) {
            setOpened(true);
          }
        }}
      />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        transitionProps={{ transition: "slide-up", duration: 200 }}
        centered
        fullScreen={isMobile}
        closeButtonProps={{
          bg: "sage-green",
          c: "white",
          size: "lg",
        }}
        size="calc(50vw - 3rem)"
      >
        {selectedGroup && <RsvpForm selectedGroup={selectedGroup} />}
      </Modal>
    </SectionContainer>
  );
};

export default RSVP;

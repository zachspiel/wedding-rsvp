"use client";

import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Event, Group } from "@spiel-wedding/types/Guest";
import { useEffect, useState } from "react";

interface Props {
  events: Event[];
  selectedGroup: Group;
  children: React.ReactNode;
}

const RsvpModal = ({ events, selectedGroup, children }: Props) => {
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  useEffect(() => {
    if (selectedGroup) {
      setOpened(true);
    }
  }, [selectedGroup]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      transitionProps={{ transition: "slide-up", duration: 200 }}
      centered
      fullScreen={isMobile}
      closeButtonProps={{
        bg: "sage-green",
        c: "white",
        size: "lg",
      }}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      size="calc(60vw - 3rem)"
    >
      {children}
    </Modal>
  );
};

export default RsvpModal;

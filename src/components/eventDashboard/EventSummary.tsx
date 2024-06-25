"use client";

import { Modal, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EventCard from "@spiel-wedding/features/RsvpForm/components/EventCard";
import { Event, Group as Party } from "@spiel-wedding/types/Guest";
import { useState } from "react";
import EditEvent from "./EditEvent";
import classes from "./dashboard.module.css";

interface Props {
  events: Event[];
  groups: Party[];
}

const EventSummary = ({ events, groups }: Props) => {
  const [opened, { close, open }] = useDisclosure();
  const [selectedEvent, setCurrentEvent] = useState<Event | null>();

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {events.map((event) => {
          return (
            <EventCard
              event={event}
              guests={groups.flatMap((group) => group.guests)}
              key={`${event.event_id}-card`}
              openUpdateModal={() => {
                setCurrentEvent(event);
                open();
              }}
            />
          );
        })}
      </SimpleGrid>

      <Modal
        opened={opened}
        onClose={close}
        title={`Edit ${selectedEvent?.title}`}
        size="calc(50vw - 3rem)"
        classNames={classes}
      >
        {selectedEvent && <EditEvent event={selectedEvent} groups={groups} />}
      </Modal>
    </>
  );
};

export default EventSummary;

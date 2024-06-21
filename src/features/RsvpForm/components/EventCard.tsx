"use client";

import { Card, Title, Group, Stack, rem, Text, Table, Button } from "@mantine/core";
import { Event, Guest, Group as Party } from "@spiel-wedding/types/Guest";
import {
  IconBuildingCastle,
  IconCalendarHeart,
  IconClock,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import RsvpSelection from "./RsvpSelectionInput";
import { CSSProperties } from "react";
import { UseFormReturnType } from "@mantine/form";
import classes from "../rsvpFormStyles.module.css";

interface Props {
  event: Event;
  guests: Guest[];
  form?: UseFormReturnType<Party>;
  openUpdateModal?: () => void;
}

const iconStyles: CSSProperties = {
  width: rem(18),
  height: rem(18),
  marginRight: rem(5),
};

const EventCard = ({ event, form, guests, openUpdateModal }: Props) => {
  const createDetailSection = (
    icon: JSX.Element,
    label: string,
    detail: string,
    withBorder?: boolean
  ) => {
    return (
      <Card.Section mt="xs" withBorder={withBorder}>
        <Group mx="md" gap="lg" mb={withBorder ? "xs" : ""}>
          <Stack gap="xs">
            <Text size="sm" c="dimmed" display="flex" style={{ alignItems: "center" }}>
              {icon}

              {label}
            </Text>
            <Text size="sm">{detail}</Text>
          </Stack>
        </Group>
      </Card.Section>
    );
  };

  return (
    <Card key={`event-${event.event_id}-rsvp`} withBorder mb="lg">
      <Card.Section bg="#8e9386" c="white" p="sm">
        <Title order={4} fw="normal" ta="center" className={classes.eventTitle}>
          {event.emoji}
          {event.title}
        </Title>
      </Card.Section>

      {createDetailSection(
        <IconBuildingCastle style={iconStyles} stroke={1.5} />,
        "Location",
        event.location
      )}

      {createDetailSection(
        <IconCalendarHeart style={iconStyles} stroke={1.5} />,
        "Date",
        new Date(event.date).toDateString()
      )}

      {createDetailSection(
        <IconClock style={iconStyles} stroke={1.5} />,
        "Time",
        event.time
      )}

      {createDetailSection(
        <IconMapPin style={iconStyles} stroke={1.5} />,
        "Address",
        `${event.address1} ${event.address2 || ""} ${event.city}, ${event.postal || ""}`,
        form !== undefined
      )}

      {form === undefined
        ? createDetailSection(
            <IconUsers style={iconStyles} stroke={1.5} />,
            "Invited Guests",
            guests
              .filter((guest) =>
                guest.event_responses.some(
                  (response) => response.eventId === event.event_id
                )
              )
              .length.toString(),
            true
          )
        : null}

      {!form && (
        <Card.Section>
          <Group justify="flex-end" p="sm">
            <Button onClick={openUpdateModal}>Edit</Button>
          </Group>
        </Card.Section>
      )}
      {form && (
        <Card.Section p="md">
          <Table
            highlightOnHover
            horizontalSpacing="md"
            verticalSpacing="xs"
            layout="fixed"
          >
            <Table.Tbody>
              {guests.map((guest, guestIndex) => {
                const eventResponse = guest.event_responses.filter(
                  (response) => response.eventId === event.event_id
                )[0];
                const eventIndex = guest.event_responses.findIndex(
                  (response) => response.response_id === eventResponse.response_id
                );

                return (
                  <Table.Tr key={`guest-${guest.guest_id}-${event.event_id}`}>
                    <Table.Td>
                      <Text>
                        {guest.nameUnknown && "Guest name unknown"}
                        {!guest.nameUnknown && `${guest.firstName} ${guest.lastName}`}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <RsvpSelection
                        form={form}
                        guestIndex={guestIndex}
                        responseIndex={eventIndex}
                      />
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card.Section>
      )}
    </Card>
  );
};

export default EventCard;

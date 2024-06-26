"use client";

import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Event, Guest, Group as Party } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";
import {
  IconBuildingCastle,
  IconCalendarHeart,
  IconExternalLink,
  IconMapPin,
  IconTie,
  IconUsers,
} from "@tabler/icons-react";
import { CSSProperties } from "react";
import classes from "../rsvpFormStyles.module.css";
import RsvpSelection from "./RsvpSelectionInput";

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
  const getAddressURL = () => {
    const { address1, address2, city, state, postal } = event;
    const query = [address1, address2 || "", city, state, postal];
    return `https://www.google.com/maps/search/?api=1&query=${query.join("%20")}`;
  };

  const createDetailSection = (
    icon: JSX.Element,
    label: string,
    detail: JSX.Element,
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
            {detail}
          </Stack>
        </Group>
      </Card.Section>
    );
  };

  const createDefaulDetailElement = (detail: string) => {
    return <Text size="sm">{detail}</Text>;
  };
  return (
    <Card key={`event-${event.event_id}-rsvp`} withBorder mb="lg">
      <Card.Section bg="#8e9386" c="white" p="sm">
        <Title order={4} fw="normal" ta="center" className={classes.eventTitle}>
          {event.emoji} {event.title}
        </Title>
      </Card.Section>

      {createDetailSection(
        <IconBuildingCastle style={iconStyles} stroke={1.5} />,
        "Location",
        createDefaulDetailElement(event.location)
      )}

      {createDetailSection(
        <IconMapPin style={iconStyles} stroke={1.5} />,
        "Address",
        <Group gap="xs" align="center" justify="space-between">
          <Text size="sm">
            {`${event.address1} ${event.address2 || ""} ${event.city}, ${event.state} ${
              event.postal || ""
            }`}
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            component="a"
            href={getAddressURL()}
            target="_blank"
            display="flex"
          >
            <IconExternalLink style={iconStyles} stroke={1.5} />
          </ActionIcon>
        </Group>
      )}

      {createDetailSection(
        <IconCalendarHeart style={iconStyles} stroke={1.5} />,
        "Date & Time",
        createDefaulDetailElement(
          `${new Date(event.date).toDateString()} • ${event.time}`
        )
      )}

      {createDetailSection(
        <IconTie style={iconStyles} stroke={1.5} />,
        "Attire",
        createDefaulDetailElement(event.attire),
        form !== undefined
      )}

      {form === undefined
        ? createDetailSection(
            <IconUsers style={iconStyles} stroke={1.5} />,
            "Invited Guests",
            createDefaulDetailElement(getGuestsForEvent(event, guests).length.toString()),
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

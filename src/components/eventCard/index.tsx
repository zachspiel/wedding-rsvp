"use client";

import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Flex,
  Group,
  Stack,
  Table,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Event, Guest, Group as Party } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";
import {
  IconBuildingCastle,
  IconCalendarHeart,
  IconCopy,
  IconDownload,
  IconEye,
  IconHanger,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { saveAs } from "file-saver";
import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import RsvpSelection from "../../features/RsvpForm/components/RsvpSelectionInput";
import classes from "./eventCard.module.css";

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
  const [opened, { open, close }] = useDisclosure(false);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setDate(new Date(event.date).toDateString());
  }, []);

  const createFormattedURL = () => {
    return `${event.address1} ${event.address2 || ""} ${event.city}, ${event.state} ${
      event.postal || ""
    }`;
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

  const createDefaultDetailElement = (detail: string) => {
    return <Text size="sm">{detail}</Text>;
  };

  const createPreviewElement = (detail: string, url: string) => {
    return (
      <Group gap="xs" align="center" justify="space-between">
        <Text size="sm">{detail}</Text>
        <ActionIcon variant="subtle" color="gray" onClick={open}>
          <IconEye style={iconStyles} stroke={1.5} />
        </ActionIcon>
      </Group>
    );
  };

  const createCopyElement = (detail: string) => {
    return (
      <Group gap="xs" align="center" justify="space-between">
        <Text size="sm">{detail}</Text>

        <CopyToClipboard
          text={detail}
          onCopy={() => {
            showNotification({
              color: "blue",
              message: "Copied to clipboard",
            });
          }}
        >
          <ActionIcon variant="subtle" color="gray" display="flex">
            <IconCopy style={iconStyles} stroke={1.5} />
          </ActionIcon>
        </CopyToClipboard>
      </Group>
    );
  };

  const handleDownload = () => {
    if (event.imageUrl) {
      saveAs(event.imageUrl, `${event.title}.png`);
    }
  };

  return (
    <>
      <Card key={`event-${event.event_id}-rsvp`} withBorder mb="lg">
        <Card.Section bg="#8e9386" c="white" p="sm">
          <Title order={4} fw="normal" ta="center" className={classes.eventTitle}>
            {event.emoji} {event.title}
          </Title>
        </Card.Section>

        {createDetailSection(
          <IconBuildingCastle style={iconStyles} stroke={1.5} />,
          "Location",
          event.imageUrl
            ? createPreviewElement(event.location, event.imageUrl)
            : createDefaultDetailElement(event.location)
        )}

        {createDetailSection(
          <IconMapPin style={iconStyles} stroke={1.5} />,
          "Address",
          createCopyElement(createFormattedURL())
        )}

        {createDetailSection(
          <IconCalendarHeart style={iconStyles} stroke={1.5} />,
          "Date & Time",
          createDefaultDetailElement(`${date} • ${event.time}`)
        )}

        {createDetailSection(
          <IconHanger style={iconStyles} stroke={1.5} />,
          "Attire",
          createDefaultDetailElement(event.attire),
          form !== undefined
        )}

        {form === undefined
          ? createDetailSection(
              <IconUsers style={iconStyles} stroke={1.5} />,
              "Invited Guests",
              createDefaultDetailElement(
                getGuestsForEvent(event, guests).length.toString()
              ),
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
      {event.imageUrl && (
        <Drawer
          opened={opened}
          onClose={close}
          title={`${event.location} Map`}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          closeButtonProps={{
            bg: "sage-green",
            c: "white",
            size: "lg",
          }}
        >
          <Flex direction="column" h="100%" p="xs">
            <Button
              size="sm"
              ml="auto"
              leftSection={<IconDownload strokeWidth={1.5} />}
              onClick={handleDownload}
            >
              Save Map
            </Button>
            <div
              style={{
                minHeight: 400,
                zIndex: -1,
              }}
            >
              <Image
                src={event.imageUrl}
                fill
                alt={event.location}
                style={{ objectFit: "contain" }}
                sizes="(min-width: 808px) 75vh"
              />
            </div>
          </Flex>
        </Drawer>
      )}
    </>
  );
};

export default EventCard;

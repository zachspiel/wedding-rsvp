"use client";

import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Chip,
  Divider,
  Flex,
  Group as MGroup,
  Modal,
  Table,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SectionTitle } from "@spiel-wedding/components/common";
import BulkEditGroups from "@spiel-wedding/components/guestList/BulkEditGroups";
import EditGuest from "@spiel-wedding/components/guestList/EditGuest";
import FilterSelection from "@spiel-wedding/components/guestList/filters/FilterSelection";
import Summary from "@spiel-wedding/components/guestList/Summary";
import TableRows from "@spiel-wedding/features/GuestListTable/components/TableRows";
import {
  RsvpFilter,
  filterGroups,
  sortGroups,
} from "@spiel-wedding/features/GuestListTable/tableUtils";
import { getEvents } from "@spiel-wedding/hooks/events";
import { GROUP_SWR_KEY, getGroups } from "@spiel-wedding/hooks/guests";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { IconChevronDown, IconChevronUp, IconSearch, IconX } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import AddGroupForm from "../AddGroupForm/AddGroupForm";
import classes from "./styles.module.css";

interface ThProps {
  children: React.ReactNode;
  onSort(): void;
}

const GuestListTable = (): JSX.Element => {
  const { data: groups } = useSWR(GROUP_SWR_KEY, getGroups, { fallbackData: [] });
  const { data: events } = useSWR("events", getEvents, { fallbackData: [] });

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [eventRsvpFilters, setEventRsvpFilters] = useState<RsvpFilter>();

  useEffect(() => {
    if (eventRsvpFilters) {
      return;
    }

    const newFilters: RsvpFilter = {};

    events.forEach((event) => {
      newFilters[event.event_id] = [];
    });

    setEventRsvpFilters(newFilters);
  }, [events]);

  const filteredGroups = filterGroups(
    sortGroups(groups, reverseSortDirection),
    search,
    filters,
    eventRsvpFilters
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const openModal = (group: Group): void => {
    setSelectedGroup(group);
    open();
  };

  const updateSortedGroups = () => {
    const reversed = !reverseSortDirection;
    setReverseSortDirection(reversed);
  };

  const Th = ({ children, onSort }: ThProps) => {
    const Icon = reverseSortDirection ? IconChevronUp : IconChevronDown;

    return (
      <Table.Th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <MGroup justify="space-between">
            <Text fw={500} fz="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </Center>
          </MGroup>
        </UnstyledButton>
      </Table.Th>
    );
  };

  return (
    <>
      <SectionTitle title="All Guests" hideFlowers />

      <Summary
        groups={groups}
        ceremonyEvent={events.find((event) => event.order === 1)}
      />

      <MGroup justify="end" mx="xl" mb="md">
        <AddGroupForm events={events} />
        <Button disabled={selectedRows.length === 0} onClick={open}>
          Edit Groups
        </Button>
      </MGroup>

      <MGroup>
        <TextInput
          placeholder="Search by any field"
          w={{ base: "100%", md: "50%" }}
          value={search}
          onChange={handleSearchChange}
          leftSection={<IconSearch size="0.9rem" stroke={1.5} />}
          rightSection={
            search.length > 0 && (
              <ActionIcon onClick={() => setSearch("")} variant="subtle">
                <IconX />
              </ActionIcon>
            )
          }
        />
        <FilterSelection
          groups={groups}
          events={events}
          filters={filters}
          setFilters={setFilters}
        />
      </MGroup>

      <Divider my="md" />

      <MGroup justify="space-between">
        <span>
          Showing <b> {filteredGroups.flatMap((group) => group.guests).length}</b> of{" "}
          <b>{groups.flatMap((group) => group.guests).length}</b> Guests
        </span>

        <Button
          variant="outline"
          size="sm"
          radius="xl"
          display={
            Object.values(eventRsvpFilters ?? {}).every((filter) => filter.length === 0)
              ? "none"
              : ""
          }
          leftSection={<IconX stroke={1.5} />}
          onClick={() => setEventRsvpFilters(undefined)}
        >
          Clear
        </Button>
      </MGroup>

      <MGroup mt="lg">
        {events.map((event, index) => {
          const handleChange = (responses: string | string[]) => {
            const updatedFilter = Array.isArray(responses) ? responses : [responses];

            setEventRsvpFilters((current) => ({
              ...current,
              [event.event_id]: updatedFilter as RsvpResponse[],
            }));
          };

          return (
            <div key={`event-${event.event_id}-rsvpFilters`}>
              <Text ta="center">{event.title}</Text>
              <Chip.Group
                multiple
                value={eventRsvpFilters?.[event.event_id] ?? []}
                onChange={handleChange}
              >
                <Flex gap="xs" pb="md">
                  <Chip
                    key={`event-${event.event_id}.accepted`}
                    size="sm"
                    value={RsvpResponse.ACCEPTED}
                  >
                    ✅ Accepted
                  </Chip>
                  <Chip
                    key={`event-${event.event_id}.declined`}
                    size="sm"
                    value={RsvpResponse.DECLINED}
                  >
                    ❌ Declined
                  </Chip>
                  <Chip
                    key={`event-${event.event_id}.noResponse`}
                    size="sm"
                    value={RsvpResponse.NO_RESPONSE}
                  >
                    🤷 No Response
                  </Chip>

                  {index !== events.length - 1 && <Divider orientation="vertical" />}
                </Flex>
              </Chip.Group>
            </div>
          );
        })}
      </MGroup>

      <Table miw={700} highlightOnHover stickyHeader stickyHeaderOffset={100}>
        <TableThead bg="sage-green" c="white">
          <TableTr>
            <TableTh>
              <Checkbox
                checked={selectedRows.length === groups?.length}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setSelectedRows(groups.map(({ group_id }) => group_id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </TableTh>
            <Th onSort={updateSortedGroups}>Name</Th>
            <TableTh>Email</TableTh>
            <TableTh>Mailing Address</TableTh>

            <>
              {events.map((event) => (
                <TableTh key={`${event.event_id}_table_header`}>
                  {event.title} {event.emoji}
                </TableTh>
              ))}
            </>

            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableRows
            groups={filteredGroups}
            events={events}
            selectedGroups={selectedRows}
            openModal={openModal}
            toggleGroupSelected={({ group_id }) => {
              if (selectedRows.includes(group_id)) {
                setSelectedRows(selectedRows.filter((id) => group_id !== id));
              } else {
                setSelectedRows([...selectedRows, group_id]);
              }
            }}
          />
        </TableTbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Edit Guest" size="lg">
        {selectedGroup && (
          <EditGuest
            group={selectedGroup}
            close={() => {
              close();
              setSelectedGroup(undefined);
            }}
            events={events ?? []}
          />
        )}

        {selectedGroup === undefined && (
          <BulkEditGroups
            groups={
              groups?.filter(({ group_id }) => selectedRows.includes(group_id)) ?? []
            }
            events={events ?? []}
          />
        )}
      </Modal>
    </>
  );
};

export default GuestListTable;

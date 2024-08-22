"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
  Group as MGroup,
  Modal,
  Switch,
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
import { DownloadGuestList } from "@spiel-wedding/features/DownloadGuestList";
import TableRows from "@spiel-wedding/features/GuestListTable/components/TableRows";
import {
  filterGroups,
  sortGroups,
} from "@spiel-wedding/features/GuestListTable/tableUtils";
import { getEvents } from "@spiel-wedding/hooks/events";
import { GROUP_SWR_KEY, getGroups } from "@spiel-wedding/hooks/guests";
import { Group } from "@spiel-wedding/types/Guest";
import { IconChevronDown, IconChevronUp, IconSearch, IconX } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
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
  const [showRsvpStatus, setShowRsvpStatus] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredGroups = filterGroups(
    sortGroups(groups, reverseSortDirection),
    search,
    filters
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
      <MGroup justify="space-between">
        <SectionTitle title="All Guests" hideFlowers />
        <MGroup>
          <DownloadGuestList groups={groups} />
          <AddGroupForm events={events} />
        </MGroup>
      </MGroup>
      <Summary
        groups={groups}
        ceremonyEvent={events.find((event) => event.order === 1)}
      />
      <MGroup justify="space-between">
        <FilterSelection
          groups={groups}
          events={events}
          filters={filters}
          setFilters={setFilters}
        />
        <Switch
          label="Show RSVP Status"
          checked={showRsvpStatus}
          onChange={(e): void => setShowRsvpStatus(e.currentTarget.checked)}
        />
      </MGroup>
      <MGroup mb="md">
        <TextInput
          placeholder="Search by any field"
          w="75%"
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
        <Button disabled={selectedRows.length === 0} onClick={open}>
          Edit Groups
        </Button>
      </MGroup>
      <Badge variant="dot" color="blue" fw="normal" size="lg" my="md">
        Showing {filteredGroups.flatMap((group) => group.guests).length} Guests
      </Badge>

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
            {showRsvpStatus && (
              <>
                {events.map((event) => (
                  <TableTh key={`${event.event_id}_table_header`}>
                    {event.title} {event.emoji}
                  </TableTh>
                ))}
              </>
            )}
            <TableTh>Save the Date Sent?</TableTh>
            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableRows
            groups={filteredGroups}
            events={events}
            showRsvpStatus={showRsvpStatus}
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

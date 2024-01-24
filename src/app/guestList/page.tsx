"use client";

import {
  Container,
  Group as MGroup,
  SimpleGrid,
  Switch,
  ScrollArea,
  TextInput,
  Table,
  Modal,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import EditGuest from "@spiel-wedding/components/guestList/EditGuest";
import Summary from "@spiel-wedding/components/guestList/Summary";
import AddGuest from "@spiel-wedding/components/guestList/addGuestForm/AddGuest";
import FilterSelection from "@spiel-wedding/components/guestList/filters/FilterSelection";
import { useDisclosure } from "@mantine/hooks";
import { filterGroups } from "@spiel-wedding/components/guestList/table/tableUtils";
import { Group } from "@spiel-wedding/types/Guest";
import TableRow from "@spiel-wedding/components/guestList/table/TableRow";
import { SectionTitle } from "@spiel-wedding/common";
import { useState, useMemo, ChangeEvent } from "react";
import useSWR from "swr";
import { getGroups, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";

export default function GuestList() {
  const { data: groups } = useSWR(GROUP_SWR_KEY, getGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [opened, { open, close }] = useDisclosure(false);
  const [showRsvpStatus, setShowRsvpStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const filteredGroups = useMemo(
    () => filterGroups(groups ?? [], search, filters),
    [search, filters, groups],
  );

  const openModal = (group: Group): void => {
    setSelectedGroup(group);
    open();
  };

  const rows = filteredGroups.map((group) => (
    <TableRow
      key={group.id}
      group={group}
      showRsvpStatus={showRsvpStatus}
      openModal={openModal}
    />
  ));

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleFilterChange = (updatedFilters: string[]): void => {
    setFilters(updatedFilters);
  };

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <MGroup justify="space-between">
          <SectionTitle title="All Guests" id="allGuests" />
          <AddGuest />
        </MGroup>
        <Summary groups={groups ?? []} />
        <MGroup justify="space-between">
          <FilterSelection
            groups={groups ?? []}
            filters={filters}
            setFilters={handleFilterChange}
          />
          <Switch
            label="Show RSVP Status"
            checked={showRsvpStatus}
            onChange={(e): void => setShowRsvpStatus(e.currentTarget.checked)}
          />
        </MGroup>
        <ScrollArea>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            rightSection={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email & Mobile</th>
                <th>Mailing Address</th>
                {showRsvpStatus && <th>RSVP Status</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
        <Modal opened={opened} onClose={close} title="Edit Guest" size="lg">
          {selectedGroup && <EditGuest group={selectedGroup} close={close} />}
        </Modal>
      </SimpleGrid>
    </Container>
  );
}

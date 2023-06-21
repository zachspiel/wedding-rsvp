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
import { database } from "@spiel-wedding/database/database";
import { ref, onValue } from "firebase/database";
import { filterGroups } from "@spiel-wedding/components/guestList/table/tableUtils";
import { Group } from "@spiel-wedding/types/Guest";
import TableRow from "@spiel-wedding/components/guestList/table/TableRow";
import { SectionTitle } from "@spiel-wedding/common";
import { useState, useMemo, useEffect, ChangeEvent } from "react";

export default function GuestList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [opened, { open, close }] = useDisclosure(false);
  const [showRsvpStatus, setShowRsvpStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const filteredGroups = useMemo(
    () => filterGroups(groups, search, filters),
    [search, filters, groups]
  );

  useEffect(() => {
    const groupsRef = ref(database, "groups/");
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      const groupData = Object.values(data);
      setGroups(groupData as Group[]);
    });
  }, []);

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
        <MGroup position="apart">
          <SectionTitle title="All Guests" id="allGuests" />
          <AddGuest />
        </MGroup>
        <Summary groups={groups} />
        <MGroup position="apart">
          <FilterSelection
            groups={groups}
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
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
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

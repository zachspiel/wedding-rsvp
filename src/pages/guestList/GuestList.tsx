import React from "react";
import { onValue, ref } from "@firebase/database";
import { Group } from "../../types/Guest";
import {
  Container,
  Group as MGroup,
  Modal,
  ScrollArea,
  SimpleGrid,
  Switch,
  Table,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SectionTitle from "../../components/common/SectionTitle";
import { database } from "../../database/database";
import EditGuest from "./components/EditGuest";
import Summary from "./components/Summary";
import AddGuest from "./addGuestForm/AddGuest";
import Navbar from "../../components/navbar/Navbar";
import TableRow from "./table/TableRow";
import { IconSearch } from "@tabler/icons";
import { filterGroups } from "./table/tableUtils";
import FilterSelection from "./filters/FilterSelection";
import Footer from "../../components/navbar/Footer";

const GuestList = (): JSX.Element => {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<Group>();
  const [opened, { open, close }] = useDisclosure(false);
  const [showRsvpStatus, setShowRsvpStatus] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<string[]>([]);

  const filteredGroups = React.useMemo(
    () => filterGroups(groups, search, filters),
    [search, filters, groups],
  );

  React.useEffect(() => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleFilterChange = (updatedFilters: string[]): void => {
    setFilters(updatedFilters);
  };

  return (
    <>
      <Navbar showHome />
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
      <Footer />
    </>
  );
};

export default GuestList;

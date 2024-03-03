"use client";

import {
  Group as MGroup,
  TextInput,
  ActionIcon,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  Switch,
  Modal,
  UnstyledButton,
  Text,
  Center,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditGuest from "@spiel-wedding/components/guestList/EditGuest";
import FilterSelection from "@spiel-wedding/components/guestList/filters/FilterSelection";
import TableRows from "@spiel-wedding/features/GuestListTable/components/TableRows";
import {
  filterGroups,
  sortGroups,
} from "@spiel-wedding/features/GuestListTable/tableUtils";
import { Group, Guest } from "@spiel-wedding/types/Guest";
import { IconChevronDown, IconChevronUp, IconSearch, IconX } from "@tabler/icons-react";
import { ChangeEvent, useMemo, useState } from "react";
import classes from "./styles.module.css";

interface Props {
  groups: Group[];
}

interface ThProps {
  children: React.ReactNode;
  onSort(): void;
}

const GuestListTable = ({ groups }: Props): JSX.Element => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [showRsvpStatus, setShowRsvpStatus] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const filteredGroups = useMemo(
    () => filterGroups(sortGroups(groups ?? [], reverseSortDirection), search, filters),
    [search, filters, groups, reverseSortDirection]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleFilterChange = (updatedFilters: string[]): void => {
    setFilters(updatedFilters);
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
      <TextInput
        placeholder="Search by any field"
        mb="md"
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
      <Table highlightOnHover>
        <TableThead>
          <TableTr>
            <Th onSort={updateSortedGroups}>Name</Th>
            <TableTh>Email</TableTh>
            <TableTh>Mailing Address</TableTh>
            {showRsvpStatus && <TableTh>RSVP Status</TableTh>}
            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableRows
            groups={filteredGroups}
            showRsvpStatus={showRsvpStatus}
            openModal={openModal}
          />
        </TableTbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Edit Guest" size="lg">
        {selectedGroup && <EditGuest group={selectedGroup} close={close} />}
      </Modal>
    </>
  );
};

export default GuestListTable;

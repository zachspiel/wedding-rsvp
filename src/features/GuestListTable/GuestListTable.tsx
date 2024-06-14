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
  Checkbox,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditGuest from "@spiel-wedding/components/guestList/EditGuest";
import FilterSelection from "@spiel-wedding/components/guestList/filters/FilterSelection";
import TableRows from "@spiel-wedding/features/GuestListTable/components/TableRows";
import {
  filterGroups,
  sortGroups,
} from "@spiel-wedding/features/GuestListTable/tableUtils";
import { Group } from "@spiel-wedding/types/Guest";
import { IconChevronDown, IconChevronUp, IconSearch, IconX } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
import classes from "./styles.module.css";
import useSWR from "swr";
import { GROUP_SWR_KEY, getGroups } from "@spiel-wedding/hooks/guests";
import Summary from "@spiel-wedding/components/guestList/Summary";
import AddGroupForm from "../AddGroupForm/AddGroupForm";
import { SectionTitle } from "@spiel-wedding/components/common";
import { DownloadGuestList } from "@spiel-wedding/features/DownloadGuestList";
import BulkEditGroups from "@spiel-wedding/components/guestList/BulkEditGroups";

interface ThProps {
  children: React.ReactNode;
  onSort(): void;
}

const GuestListTable = (): JSX.Element => {
  const { data: groups } = useSWR(GROUP_SWR_KEY, getGroups);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [showRsvpStatus, setShowRsvpStatus] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredGroups = filterGroups(
    sortGroups(groups ?? [], reverseSortDirection),
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
          <DownloadGuestList groups={groups ?? []} />
          <AddGroupForm />
        </MGroup>
      </MGroup>
      <Summary groups={groups ?? []} />
      <MGroup justify="space-between">
        <FilterSelection
          groups={groups ?? []}
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
      <Table highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>
              <Checkbox
                checked={selectedRows.length === groups?.length}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setSelectedRows((groups ?? []).map(({ id }) => id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </TableTh>
            <Th onSort={updateSortedGroups}>Name</Th>
            <TableTh>Email</TableTh>
            <TableTh>Mailing Address</TableTh>
            {showRsvpStatus && <TableTh>RSVP Status</TableTh>}
            <TableTh>Save the Date Sent?</TableTh>
            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableRows
            groups={filteredGroups}
            showRsvpStatus={showRsvpStatus}
            selectedGroups={selectedRows}
            openModal={openModal}
            toggleGroupSelected={(group) => {
              if (selectedRows.includes(group.id)) {
                setSelectedRows(selectedRows.filter((id) => group.id !== id));
              } else {
                setSelectedRows([...selectedRows, group.id]);
              }
            }}
          />
        </TableTbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Edit Guest" size="lg">
        {selectedGroup && <EditGuest group={selectedGroup} close={close} />}

        {selectedGroup === undefined && (
          <BulkEditGroups
            groups={groups?.filter(({ id }) => selectedRows.includes(id)) ?? []}
          />
        )}
      </Modal>
    </>
  );
};

export default GuestListTable;

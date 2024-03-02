"use client";

import { Alert, Container, Group, Group as MGroup, SimpleGrid } from "@mantine/core";
import Summary from "@spiel-wedding/components/guestList/Summary";
import { SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import { getGroups, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { DownloadGuestList } from "@spiel-wedding/features/DownloadGuestList";
import AddGroupForm from "@spiel-wedding/features/AddGroupForm/AddGroupForm";

export default function GuestList() {
  const { data: groups, error } = useSWR(GROUP_SWR_KEY, getGroups);

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <MGroup justify="space-between">
          <SectionTitle title="All Guests" id="allGuests" />
          <Group>
            <DownloadGuestList groups={groups ?? []} />
            <AddGroupForm />
          </Group>
        </MGroup>
        {error && <Alert color="red" title={error} />}
        <Summary groups={groups ?? []} />
        <GuestListTable groups={groups ?? []} />
      </SimpleGrid>
    </Container>
  );
}

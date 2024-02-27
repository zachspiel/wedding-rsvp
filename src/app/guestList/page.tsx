"use client";

import { Container, Group as MGroup, SimpleGrid } from "@mantine/core";
import Summary from "@spiel-wedding/components/guestList/Summary";
import AddGuest from "@spiel-wedding/components/guestList/addGuestForm/AddGuest";
import { SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import { getGroups, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import DownloadGuestList from "@spiel-wedding/features/DownloadGuestList/DownloadGuestList";
import { showNotification } from "@mantine/notifications";

export default function GuestList() {
  const { data: result } = useSWR(GROUP_SWR_KEY, getGroups);

  if (result?.error) {
    showNotification({
      color: "red",
      message: result.error,
    });
  }

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <MGroup justify="space-between">
          <SectionTitle title="All Guests" id="allGuests" />
          <AddGuest />
          <DownloadGuestList groups={result?.data ?? []} />
        </MGroup>
        <Summary groups={result?.data ?? []} />
        <GuestListTable groups={result?.data ?? []} />
      </SimpleGrid>
    </Container>
  );
}

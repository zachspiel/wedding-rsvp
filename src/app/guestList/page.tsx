"use client";

import { Alert, Container, Group, Group as MGroup, SimpleGrid } from "@mantine/core";
import Summary from "@spiel-wedding/components/guestList/Summary";
import { SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import { getGroups, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import DownloadGuestList from "@spiel-wedding/features/DownloadGuestList/DownloadGuestList";
import AddGroupForm from "@spiel-wedding/features/AddGroupForm/AddGroupForm";
import useSignInStatus from "@spiel-wedding/hooks/signInStatus";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuestList() {
  const { data: groups, error, isLoading } = useSWR(GROUP_SWR_KEY, getGroups);
  const router = useRouter();
  const { isSignedIn } = useSignInStatus();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, []);

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        {!isLoading && (
          <>
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
          </>
        )}
      </SimpleGrid>
    </Container>
  );
}

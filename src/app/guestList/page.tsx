"use client";

import {
  Alert,
  Container,
  Group,
  Group as MGroup,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import Summary from "@spiel-wedding/components/guestList/Summary";
import { SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import { getGroups, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { DownloadGuestList } from "@spiel-wedding/features/DownloadGuestList";
import AddGroupForm from "@spiel-wedding/features/AddGroupForm/AddGroupForm";
import useSignInStatus from "@spiel-wedding/hooks/signInStatus";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuestList() {
  const { isSignedIn } = useSignInStatus();

  const {
    data: groups,
    error,
    isLoading,
  } = useSWR(() => (isSignedIn ? GROUP_SWR_KEY : null), getGroups);

  const router = useRouter();

  useEffect(() => {
    if (isSignedIn !== undefined && !isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn]);

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        {!isLoading && isSignedIn && (
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

        {isSignedIn === undefined ||
          (isLoading && (
            <>
              <Skeleton w="100%" h={25} />

              <Skeleton w="100%" h={25} my="md" />

              <Skeleton w="100%" h={25} />
            </>
          ))}
      </SimpleGrid>
    </Container>
  );
}

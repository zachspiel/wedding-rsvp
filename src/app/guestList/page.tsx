import { Container, Group as MGroup, SimpleGrid } from "@mantine/core";
import Summary from "@spiel-wedding/components/guestList/Summary";
import { SectionTitle } from "@spiel-wedding/common";
import { getGroups } from "@spiel-wedding/hooks/guests";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { DownloadGuestList } from "@spiel-wedding/features/DownloadGuestList";
import AddGroupForm from "@spiel-wedding/features/AddGroupForm/AddGroupForm";
import { redirect } from "next/navigation";
import { createClient } from "@spiel-wedding/database/server";
import { User } from "@supabase/supabase-js";
import { Group } from "@spiel-wedding/types/Guest";

interface Props {
  user: User | null;
  groups: Group[];
}

async function getGuestList() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const result: Props = { user: data?.user, groups: [] };

  if (data?.user) {
    const groups = await getGroups();

    result["groups"] = groups;
  }

  return result;
}

export default async function GuestList() {
  const { user, groups } = await getGuestList();
  if (!user) {
    redirect("/");
  }

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <>
          <MGroup justify="space-between">
            <SectionTitle title="All Guests" hideFlowers />
            <MGroup>
              <DownloadGuestList groups={groups ?? []} />
              <AddGroupForm />
            </MGroup>
          </MGroup>
          <Summary groups={groups ?? []} />
          <GuestListTable groups={groups ?? []} />
        </>
      </SimpleGrid>
    </Container>
  );
}

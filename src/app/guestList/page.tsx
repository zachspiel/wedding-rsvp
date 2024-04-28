import { Container, SimpleGrid } from "@mantine/core";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { redirect } from "next/navigation";
import { createClient } from "@spiel-wedding/database/server";

async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return { user: data?.user };
}

export default async function GuestList() {
  const { user } = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <GuestListTable />
      </SimpleGrid>
    </Container>
  );
}

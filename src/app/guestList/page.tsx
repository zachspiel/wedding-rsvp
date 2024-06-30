import { Container, SimpleGrid } from "@mantine/core";
import { createClient } from "@spiel-wedding/database/server";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { redirect } from "next/navigation";

async function checkLoginStatus() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return redirect("/");
  }
}

export default async function GuestList() {
  await checkLoginStatus();

  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <GuestListTable />
      </SimpleGrid>
    </Container>
  );
}

import { Container, SimpleGrid } from "@mantine/core";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
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

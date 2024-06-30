import { Container, SimpleGrid } from "@mantine/core";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function checkLoginStatus() {
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

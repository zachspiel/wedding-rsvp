import { Center, Container } from "@mantine/core";
import { SectionTitle } from "@spiel-wedding/components/common";
import EventSummary from "@spiel-wedding/components/eventDashboard/EventSummary";
import { getEvents } from "@spiel-wedding/hooks/events";
import { getGroups } from "@spiel-wedding/hooks/guests";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

async function getData() {
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

  const [{ data }, groups, events] = await Promise.all([
    supabase.auth.getUser(),
    getGroups(),
    getEvents(),
  ]);

  return { user: data?.user, groups, events };
}

export default async function Events() {
  const { user, groups, events } = await getData();

  if (!user) {
    redirect("/");
  }

  return (
    <Container>
      <Center>
        <SectionTitle title="Events" hideFlowers />
      </Center>

      <EventSummary events={events} groups={groups} />
    </Container>
  );
}

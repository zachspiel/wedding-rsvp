import { redirect } from "next/navigation";
import { createClient } from "@spiel-wedding/database/server";
import { getGroups } from "@spiel-wedding/hooks/guests";
import { getEvents } from "@spiel-wedding/hooks/events";
import { Container, Center } from "@mantine/core";
import { SectionTitle } from "@spiel-wedding/components/common";
import EventSummary from "@spiel-wedding/components/eventDashboard/EventSummary";

export const revalidate = 0;

async function getData() {
  const supabase = createClient();

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

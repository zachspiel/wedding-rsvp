import { Center, Container } from "@mantine/core";
import { SectionTitle } from "@spiel-wedding/components/common";
import { createClient } from "@spiel-wedding/database/server";
import { getEvents } from "@spiel-wedding/hooks/events";
import { getGroups } from "@spiel-wedding/hooks/guests";
import { redirect } from "next/navigation";
import EventSummary from "./components/EventSummary";

export const revalidate = 0;

async function getProps() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return redirect("/");
  }

  const [groups, events] = await Promise.all([getGroups(), getEvents()]);

  return { user: data?.user, groups, events };
}

export default async function Events() {
  const { events, groups } = await getProps();

  return (
    <Container>
      <Center>
        <SectionTitle title="Events" hideFlowers />
      </Center>

      <EventSummary events={events} groups={groups} />
    </Container>
  );
}

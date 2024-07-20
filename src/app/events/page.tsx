import { Center, Container } from "@mantine/core";
import { SectionTitle } from "@spiel-wedding/components/common";
import { getEvents } from "@spiel-wedding/hooks/events";
import { getGroups } from "@spiel-wedding/hooks/guests";
import EventSummary from "./components/EventSummary";

export const revalidate = 0;

async function getProps() {
  const [groups, events] = await Promise.all([getGroups(), getEvents()]);
  return { groups, events };
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

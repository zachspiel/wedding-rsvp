import { DonutChart } from "@mantine/charts";
import { Group as MGroup, Stack, Title } from "@mantine/core";
import Summary from "@spiel-wedding/components/guestList/Summary";
import { Event, Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";

interface Props {
  groups: Group[];
  events: Event[];
}

const RsvpGraph = ({ groups, events }: Props) => {
  const allGuests = groups.flatMap((group) => group.guests);

  const rsvpTotals = events.map((event) => {
    const guests = getGuestsForEvent(event, allGuests);

    const rsvpMatchesFilter = (rsvpResponse: RsvpResponse) =>
      guests.filter(
        ({ responseMap }) => responseMap[event.event_id].rsvp === rsvpResponse
      ).length;

    const data = [
      {
        name: "Accepted",
        value: rsvpMatchesFilter(RsvpResponse.ACCEPTED),
        color: "teal.6",
      },
      {
        name: "Declined",
        value: rsvpMatchesFilter(RsvpResponse.DECLINED),
        color: "read.6",
      },
      {
        name: "No Response",
        value: rsvpMatchesFilter(RsvpResponse.NO_RESPONSE),
        color: "gray.6",
      },
    ];
  });

  return (
    <div>
      <Title order={3}>RSVP Totals</Title>
      <MGroup justify="space-between" mb="md" mt="md">
        {events.map((event) => {
          const guests = getGuestsForEvent(event, allGuests);

          const rsvpMatchesFilter = (rsvpResponse: RsvpResponse) =>
            guests.filter(
              ({ responseMap }) => responseMap[event.event_id].rsvp === rsvpResponse
            ).length;

          const data = [
            {
              name: "Accepted",
              value: rsvpMatchesFilter(RsvpResponse.ACCEPTED),
              color: "teal.6",
            },
            {
              name: "Declined",
              value: rsvpMatchesFilter(RsvpResponse.DECLINED),
              color: "red.6",
            },
            {
              name: "No Response",
              value: rsvpMatchesFilter(RsvpResponse.NO_RESPONSE),
              color: "gray.4",
            },
          ];

          return (
            <Stack ta="center" align="center">
              <Title order={5}>{event.title}</Title>
              <DonutChart
                withLabelsLine
                withLabels
                size={160}
                data={data}
                thickness={9}
              />
              <Summary groups={groups} event={event} />
            </Stack>
          );
        })}
      </MGroup>
    </div>
  );
};

export default RsvpGraph;

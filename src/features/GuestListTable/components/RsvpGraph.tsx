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

  return (
    <div>
      <Title order={3}>RSVP Totals</Title>
      <MGroup justify="space-between" mb="md" mt="md">
        {events.map((event) => {
          const guests = getGuestsForEvent(event, allGuests);

          let totalAccepted = 0;
          let totalDeclined = 0;
          let totalMissingResponse = 0;

          guests.forEach((guest) => {
            const eventResponse = guest.event_responses.find(
              (eventResponse) => eventResponse.eventId === event.event_id,
            );

            if (eventResponse?.rsvp === RsvpResponse.ACCEPTED) {
              totalAccepted++;
            } else if (eventResponse?.rsvp === RsvpResponse.DECLINED) {
              totalDeclined++;
            } else if (eventResponse?.rsvp === RsvpResponse.NO_RESPONSE) {
              totalMissingResponse++;
            }
          });

          const data = [
            {
              name: "Accepted",
              value: totalAccepted,
              color: "teal.6",
            },
            {
              name: "Declined",
              value: totalDeclined,
              color: "red.6",
            },
            {
              name: "No Response",
              value: totalMissingResponse,
              color: "gray.4",
            },
          ];

          return (
            <Stack ta="center" align="center" key={`event-${event.event_id}-graph`}>
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

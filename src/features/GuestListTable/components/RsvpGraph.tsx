import { BarChart } from "@mantine/charts";
import { Title } from "@mantine/core";
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

    return {
      event: event.title,
      accepted: rsvpMatchesFilter(RsvpResponse.ACCEPTED),
      declined: rsvpMatchesFilter(RsvpResponse.DECLINED),
      "No Response": rsvpMatchesFilter(RsvpResponse.NO_RESPONSE),
    };
  });

  return (
    <div>
      <Title order={3}>RSVP Totals</Title>
      <BarChart
        h={300}
        data={rsvpTotals}
        dataKey="event"
        withLegend
        series={[
          { name: "accepted", color: "teal.6" },
          { name: "declined", color: "red.6" },
          { name: "No Response", color: "blue.6" },
        ]}
        tickLine="y"
      />
    </div>
  );
};

export default RsvpGraph;

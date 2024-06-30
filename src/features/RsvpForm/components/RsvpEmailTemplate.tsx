import { Html } from "@react-email/html";
import { Body, Head, Preview, Text } from "@react-email/components";
import { Event, Group } from "@spiel-wedding/types/Guest";
import GuestTable from "@spiel-wedding/components/RsvpEmail/GuestTable";

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
};

interface Props {
  group: Group;
  events: Event[];
}

const RsvpEmailTemplate = ({ group, events }: Props) => {
  return (
    <Html lang="en">
      <Head />

      <Preview>{group.guests[0].firstName} has RSVPed</Preview>
      <Body>
        <Text style={paragraph}>A copy of the RSVP can be found below:</Text>
        <GuestTable guests={group.guests} events={events} />
      </Body>
    </Html>
  );
};

export default RsvpEmailTemplate;

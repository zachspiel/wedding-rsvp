import { Html } from "@react-email/html";
import { Body, Head, Preview, Text } from "@react-email/components";
import { Group } from "@spiel-wedding/types/Guest";
import GuestTable from "@spiel-wedding/components/RsvpEmail/GuestTable";

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
};

const RsvpEmailTemplate = (group: Group) => {
  return (
    <Html lang="en">
      <Head />

      <Preview>{group.guests[0].firstName} has RSVPed</Preview>
      <Body>
        <Text style={paragraph}>A copy of the RSVP can be found below:</Text>
        <GuestTable guests={group.guests} />
      </Body>
    </Html>
  );
};

export default RsvpEmailTemplate;

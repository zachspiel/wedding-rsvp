import { Html } from "@react-email/html";
import { Preview, Text } from "@react-email/components";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { Img } from "@react-email/img";

const RsvpEmailTemplate = (group: Group) => {
  return (
    <Html lang="en">
      {group.guests.map((guest) => {
        const rsvpEmoji = guest.rsvp === RsvpResponse.ACCEPTED ? "✅" : "❌";

        return (
          <Text key={guest.id}>
            {guest.firstName} {guest.lastName} - {guest.rsvp} {rsvpEmoji}
          </Text>
        );
      })}

      <Preview>{group.guests[0].firstName} has RSVPed</Preview>

      <Img
        src="https://www.zachandsedona.com/assets/images/The-Spielbergers.webp"
        height={250}
        width={250}
      />
    </Html>
  );
};

export default RsvpEmailTemplate;

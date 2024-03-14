import { Html } from "@react-email/html";
import { Heading, Preview, Text } from "@react-email/components";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { Img } from "@react-email/img";

const RsvpConfirmationEmailTemplate = (group: Group) => {
  return (
    <Html lang="en">
      <Text>Hello!</Text>
      <Text>A copy of your RSVP can be found below.</Text>

      {group.guests.map((guest) => {
        const rsvpEmoji = guest.rsvp === RsvpResponse.ACCEPTED ? "✅" : "❌";

        return (
          <Text key={guest.id}>
            {guest.firstName} {guest.lastName} - {guest.rsvp} {rsvpEmoji}
          </Text>
        );
      })}

      <Text>Thank you,</Text>
      <Text>Sedona & Zach</Text>
      <Img
        src="https://www.zachandsedona.com/assets/images/The-Spielbergers.webp"
        height={250}
        width={250}
      />
    </Html>
  );
};

export default RsvpConfirmationEmailTemplate;

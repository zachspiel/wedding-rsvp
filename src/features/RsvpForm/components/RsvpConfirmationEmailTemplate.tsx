import { Html } from "@react-email/html";
import { Text, Link } from "@react-email/components";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { Img } from "@react-email/img";
import { GOOGLE_MAPS_URL } from "@spiel-wedding/common/constants";

const RsvpConfirmationEmailTemplate = (group: Group) => {
  const anyGuestAccepted = group.guests.some(
    (guest) => guest.rsvp === RsvpResponse.ACCEPTED
  );

  return (
    <Html lang="en">
      {!anyGuestAccepted && <Text>Hey there! We&apos;re going to miss you!</Text>}

      {anyGuestAccepted && (
        <>
          <Text>Hey there! Get ready to party 💃🕺!</Text>
          <Text>
            We can&apos;t wait to see you on Saturday, October 26th at 4:00 PM at the
            Wright House in Mesa (
            <Link href={GOOGLE_MAPS_URL}>636 W University Dr, Mesa, AZ 85201</Link>).
          </Text>
        </>
      )}

      <Text>A copy of your RSVP can be found below:</Text>

      {group.guests.map((guest) => (
        <Text key={guest.id}>
          {guest.firstName} {guest.lastName} - {guest.rsvp}
        </Text>
      ))}

      <Text>Thank you,</Text>
      <Text>Sedona & Zach</Text>
      <Img
        src="https://www.zachandsedona.com/assets/images/The-Spielbergers.webp"
        height={250}
        width={250}
        style={{ borderRadius: "1000px" }}
      />
    </Html>
  );
};

export default RsvpConfirmationEmailTemplate;

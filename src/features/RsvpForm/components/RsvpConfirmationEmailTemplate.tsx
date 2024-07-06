import { Body, Container, Head, Link, Preview, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import GuestTable from "@spiel-wedding/components/RsvpEmail/GuestTable";
import { MAP_URL } from "@spiel-wedding/components/common/constants";
import { Event, Group, RsvpResponse } from "@spiel-wedding/types/Guest";

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
};

const portrait = {
  borderRadius: "1000px",
  display: "block",
  marginRight: "auto",
  marginLeft: "auto",
};

interface Props {
  group: Group;
  events: Event[];
}

const RsvpConfirmationEmailTemplate = ({ group, events }: Props) => {
  const anyGuestAccepted = group.guests.some((guest) =>
    guest.event_responses.some((response) => response.rsvp === RsvpResponse.ACCEPTED)
  );

  const previewText = anyGuestAccepted
    ? "Hey there! Get ready to party 💃🕺!"
    : "Hey there! We're going to miss you!";

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText} </Preview>
      <Body style={main}>
        <Container style={container}>
          {!anyGuestAccepted && <Text style={paragraph}>{previewText}</Text>}

          {anyGuestAccepted && (
            <>
              <Text style={paragraph}>{previewText}</Text>
              <Text style={paragraph}>
                We can&#39;t wait to see you on Saturday, October 26th at 4:00 PM at the
                Wright House in Mesa (
                <Link href={MAP_URL}>636 W University Dr, Mesa, AZ 85201</Link>).
              </Text>
            </>
          )}

          <Text style={paragraph}>A copy of your RSVP can be found below:</Text>

          <GuestTable guests={group.guests} events={events} />

          <Text style={paragraph}>Thank you,</Text>
          <Text style={paragraph}>Sedona & Zach</Text>

          <Img
            src="https://www.zachandsedona.com/assets/images/The-Spielbergers.webp"
            height={250}
            width={250}
            style={portrait}
          />
        </Container>
      </Body>
    </Html>
  );
};

export default RsvpConfirmationEmailTemplate;

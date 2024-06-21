import { rem } from "@mantine/core";
import { Section, Row, Column, Text, Heading } from "@react-email/components";
import { Event, Guest } from "@spiel-wedding/types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";
import { CSSProperties } from "react";

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
};

const detailParagraph = {
  ...paragraph,
  margin: "5px 0",
};

const dimmedParagraph = {
  ...detailParagraph,
  color: "#868e96",
  marginBottom: "0.625rem",
};

const iconStyles: CSSProperties = {
  width: rem(18),
  height: rem(18),
  marginRight: rem(5),
};

const tableRow = {
  borderBottom: "0.0625rem solid #dee2e6",
};

interface Props {
  guests: Guest[];
  events: Event[];
}

const GuestTable = ({ guests, events }: Props): JSX.Element => {
  const createColumn = (text: string, style?: CSSProperties) => {
    return (
      <Column style={{ padding: "0.4375rem", width: "50%" }}>
        <Text style={{ ...paragraph, ...style }}>{text}</Text>
      </Column>
    );
  };

  const createDetailRow = (title: string, info: string) => {
    return (
      <Row>
        <Column>
          <Text style={dimmedParagraph}>{title}</Text>
          <Text style={detailParagraph}>{info}</Text>
        </Column>
      </Row>
    );
  };

  return (
    <>
      {events
        .filter((event) => getGuestsForEvent(event, guests).length > 0)
        .sort((a, b) => a.order - b.order)
        .map((event) => {
          return (
            <>
              <Heading as="h2">
                {event.emoji} {event.title}
              </Heading>
              {createDetailRow("Location", event.location)}

              {createDetailRow("Date", new Date(event.date).toDateString())}

              {createDetailRow("Time", event.time)}

              {createDetailRow(
                "Address",
                `${event.address1} ${event.address2 || ""} ${event.city}, ${
                  event.state
                } ${event.postal}`
              )}

              <Section style={{ marginBottom: "1rem" }} key={event.event_id}>
                <Row bgcolor="#717769">
                  {createColumn("Name", { color: "#fff" })}
                  {createColumn("RSVP Status", { color: "#fff" })}
                </Row>

                {guests.map((guest) => (
                  <Row key={guest.guest_id} style={tableRow}>
                    {createColumn(`${guest.firstName} ${guest.lastName}`)}
                    {createColumn(
                      guest.event_responses.find(
                        (response) => response.eventId === event.event_id
                      )?.rsvp ?? "No Response"
                    )}
                  </Row>
                ))}
              </Section>
            </>
          );
        })}
    </>
  );
};

export default GuestTable;

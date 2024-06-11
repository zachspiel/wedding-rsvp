import { Section, Row, Column, Text } from "@react-email/components";
import { Guest } from "@spiel-wedding/types/Guest";
import { CSSProperties } from "react";

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
};

const tableRow = {
  borderBottom: "0.0625rem solid #dee2e6",
};

interface Props {
  guests: Guest[];
}

const GuestTable = ({ guests }: Props): JSX.Element => {
  const createColumn = (text: string, style?: CSSProperties) => {
    return (
      <Column style={{ padding: "0.4375rem", width: "50%" }}>
        <Text style={{ ...paragraph, ...style }}>{text}</Text>
      </Column>
    );
  };

  return (
    <Section style={{ marginBottom: "1rem" }}>
      <Row bgcolor="#717769">
        {createColumn("Name", { color: "#fff" })}
        {createColumn("RSVP Status", { color: "#fff" })}
      </Row>

      {guests.map((guest) => (
        <Row key={guest.guest_id} style={tableRow}>
          {createColumn(`${guest.firstName} ${guest.lastName}`)}
          {createColumn(guest.rsvp)}
        </Row>
      ))}
    </Section>
  );
};

export default GuestTable;

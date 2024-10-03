import { Container } from "@mantine/core";
import GuestListTable from "@spiel-wedding/features/GuestListTable/GuestListTable";

export default async function GuestList() {
  return (
    <Container fluid m="lg">
      <GuestListTable />
    </Container>
  );
}

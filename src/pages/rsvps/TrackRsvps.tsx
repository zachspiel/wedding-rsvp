import React from "react";
import { SimpleGrid, Group as MGroup, Container, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { onValue, ref } from "firebase/database";
import SectionTitle from "../../components/common/SectionTitle";
import { database } from "../../database/database";
import { Group } from "../../types/Guest";
import RsvpStatus from "./components/RsvpStatus";
import GuestsColumn from "../guestList/components/columns/GuestsColumn";
import EditGuest from "../guestList/components/EditGuest";
import Filters from "../guestList/components/Filters";
import Summary from "../guestList/components/Summary";

const TrackRsvps = (): JSX.Element => {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<Group>();
  const [opened, { close }] = useDisclosure(false);

  React.useEffect(() => {
    const guestsRef = ref(database, "groups/");
    onValue(guestsRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      setGroups(Object.values(data));
    });
  }, []);

  const rows = groups.map((group, index) => (
    <tr
      key={group.id.length > 0 ? group.id : index}
      onClick={(): void => setSelectedGroup(group)}
    >
      <td>
        <GuestsColumn guests={group.guests} />
      </td>
      <td>
        <RsvpStatus guests={group.guests} />
      </td>
    </tr>
  ));
  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <MGroup position="apart">
          <SectionTitle title="Track RSVPs" id="allGuests" />
        </MGroup>
        <Summary groups={Object.values(groups)} />
        <MGroup>
          <Filters groups={Object.values(groups)} />
        </MGroup>
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>RSVP Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Modal opened={opened} onClose={close} title="Edit Guest" size="lg">
          {selectedGroup && <EditGuest group={selectedGroup} close={close} />}
        </Modal>
      </SimpleGrid>
    </Container>
  );
};

export default TrackRsvps;

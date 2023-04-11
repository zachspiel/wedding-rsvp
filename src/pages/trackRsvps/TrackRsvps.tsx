import React from "react";
import {
  SimpleGrid,
  Group as MGroup,
  Container,
  Modal,
  Table,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { onValue, ref } from "firebase/database";
import SectionTitle from "../../features/common/SectionTitle";
import { database } from "../../features/database/database";
import AddGuest from "../../features/guests/AddGuest";
import Navbar from "../../features/navbar/Navbar";
import { Group } from "../../types/Guest";
import RsvpStatus from "./components/RsvpStatus";
import GuestsColumn from "../manageGuestList/components/columns/GuestsColumn";
import EditGuest from "../manageGuestList/components/EditGuest";
import Filters from "../manageGuestList/components/Filters";
import Summary from "../manageGuestList/components/Summary";

const TrackRsvps = (): JSX.Element => {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<Group>();
  const [opened, { close }] = useDisclosure(false);

  React.useEffect(() => {
    const guestsRef = ref(database, "guests/");
    onValue(guestsRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      const groupData = Object.keys(data).map((key) => {
        return { ...data[key], id: key };
      });

      setGroups(groupData);
    });
  }, []);

  const rows = groups.map((group, index) => (
    <tr
      key={group.id.length > 0 ? group.id : index}
      onClick={() => setSelectedGroup(group)}
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
    <>
      <Navbar showHome />

      <Container>
        <SimpleGrid cols={1} pb="xl">
          <MGroup position="apart">
            <SectionTitle title="Track RSVPs" id="allGuests" />
            <AddGuest />
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

      <Navbar showHome footer />
    </>
  );
};

export default TrackRsvps;

import React from "react";
import { onValue, ref } from "@firebase/database";
import { Group } from "../../types/Guest";
import {
  Container,
  Group as MGroup,
  Modal,
  SimpleGrid,
  Table,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SectionTitle from "../../features/common/SectionTitle";
import { database } from "../../features/database/database";
import AddGuest from "../../features/guests/AddGuest";
import ActionColumn from "./components/columns/ActionColumn";
import AddressColumn from "./components/columns/AddressColumn";
import EmailMobileColumn from "./components/columns/EmailMobileColumn";
import GuestsColumn from "./components/columns/GuestsColumn";
import InvitedColumn from "./components/columns/InvitedColumn";
import EditGuest from "./components/EditGuest";
import Filters from "./components/Filters";
import Summary from "./components/Summary";
import Navbar from "../../features/navbar/Navbar";

const GuestList = (): JSX.Element => {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<Group>();
  const [opened, { open, close }] = useDisclosure(false);

  const rows = groups.map((group, index) => (
    <tr key={group.guests[0].firstName}>
      <td>
        <GuestsColumn guests={group.guests} affiliation={group.affiliation} />
      </td>
      <td>{index}</td>
      <td>
        <EmailMobileColumn email={group.email} phone={group.phone} />
      </td>
      <td>
        <AddressColumn group={group} />
      </td>
      <td>
        <InvitedColumn groups={Object.values(groups)} index={index} />
      </td>
      <td>
        <ActionColumn
          groups={Object.values(groups)}
          groupIndex={index}
          onEdit={() => openModal(group)}
        />
      </td>
    </tr>
  ));

  const openModal = (group: Group): void => {
    setSelectedGroup(group);
    open();
  };

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

  return (
    <>
      <Navbar showHome />

      <Container>
        <SimpleGrid cols={1} pb="xl">
          <MGroup position="apart">
            <SectionTitle title="All Guests" id="allGuests" />
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
                <th>No.</th>
                <th>Email & Mobile</th>
                <th>Mailing Address</th>
                <th>Invited?</th>
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

export default GuestList;

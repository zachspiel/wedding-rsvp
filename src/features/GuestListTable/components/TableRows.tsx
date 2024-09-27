import { TableTd, TableTr, Text } from "@mantine/core";
import { Event, Group } from "@spiel-wedding/types/Guest";
import ActionColumn from "./columns/ActionColumn";
import AddressColumn from "./columns/AddressColumn";
import GuestsColumn from "./columns/GuestsColumn";
import RsvpStatusColumn from "./columns/RsvpStatusColumn";

interface Props {
  groups: Group[];
  events: Event[];
  openModal: (group: Group) => void;
}

const TableRows = (props: Props): JSX.Element => {
  return (
    <>
      {props.groups.map((group) => (
        <TableTr key={group.group_id}>
          <TableTd>
            <GuestsColumn guests={group.guests} affiliation={group.affiliation} />
          </TableTd>
          <TableTd>
            <>
              {group.email.length === 0 ? (
                <Text c="red">Missing email</Text>
              ) : (
                <Text>{group.email}</Text>
              )}
            </>
          </TableTd>
          <TableTd>
            <AddressColumn group={group} />
          </TableTd>

          <TableTd>{group.dietaryRestrictions}</TableTd>

          <>
            {props.events.map((event) => (
              <TableTd key={group.group_id + "_" + event.event_id}>
                <RsvpStatusColumn guests={group.guests} event={event} />
              </TableTd>
            ))}
          </>

          <TableTd>
            <ActionColumn group={group} onEdit={() => props.openModal(group)} />
          </TableTd>
        </TableTr>
      ))}
    </>
  );
};

export default TableRows;

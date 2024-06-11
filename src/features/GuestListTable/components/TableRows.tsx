import { Group } from "@spiel-wedding/types/Guest";
import ActionColumn from "./columns/ActionColumn";
import AddressColumn from "./columns/AddressColumn";
import GuestsColumn from "./columns/GuestsColumn";
import RsvpStatusColumn from "./columns/RsvpStatusColumn";
import { Checkbox, TableTd, TableTr, Text } from "@mantine/core";
import SaveTheDateColumn from "./columns/SaveTheDateColumn";

interface Props {
  groups: Group[];
  showRsvpStatus: boolean;
  selectedGroups: string[];
  openModal: (group: Group) => void;
  toggleGroupSelected: (group: Group) => void;
}

const TableRows = (props: Props): JSX.Element => {
  return (
    <>
      {props.groups.map((group) => (
        <TableTr key={group.group_id}>
          <TableTd>
            <Checkbox
              checked={
                props.selectedGroups.length === props.groups.length ||
                props.selectedGroups.includes(group.group_id)
              }
              onChange={(e) => props.toggleGroupSelected(group)}
            />
          </TableTd>
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
          {props.showRsvpStatus && (
            <TableTd>
              <RsvpStatusColumn guests={group.guests} />
            </TableTd>
          )}
          <TableTd>
            <SaveTheDateColumn group={group} />
          </TableTd>
          <TableTd>
            <ActionColumn group={group} onEdit={() => props.openModal(group)} />
          </TableTd>
        </TableTr>
      ))}
    </>
  );
};

export default TableRows;

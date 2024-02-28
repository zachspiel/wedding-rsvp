import { Group } from "@spiel-wedding/types/Guest";
import ActionColumn from "./columns/ActionColumn";
import AddressColumn from "./columns/AddressColumn";
import EmailMobileColumn from "./columns/EmailMobileColumn";
import GuestsColumn from "./columns/GuestsColumn";
import RsvpStatusColumn from "./columns/RsvpStatusColumn";
import { TableTd, TableTr } from "@mantine/core";

interface Props {
  groups: Group[];
  showRsvpStatus: boolean;
  openModal: (group: Group) => void;
}

const TableRows = ({ groups, showRsvpStatus, openModal }: Props): JSX.Element => {
  return (
    <>
      {groups.map((group) => (
        <TableTr key={group.id}>
          <TableTd>
            <GuestsColumn guests={group.guests} affiliation={group.affiliation} />
          </TableTd>
          <TableTd>
            <EmailMobileColumn email={group.email} phone={group.phone} />
          </TableTd>
          <TableTd>
            <AddressColumn group={group} />
          </TableTd>
          <TableTd>
            {showRsvpStatus && <RsvpStatusColumn guests={group.guests} />}
          </TableTd>
          <TableTd>
            <ActionColumn group={group} onEdit={(): void => openModal(group)} />
          </TableTd>
        </TableTr>
      ))}
    </>
  );
};

export default TableRows;

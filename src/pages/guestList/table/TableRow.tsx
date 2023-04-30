import React from "react";
import { Group } from "../../../types/Guest";
import ActionColumn from "../columns/ActionColumn";
import AddressColumn from "../columns/AddressColumn";
import EmailMobileColumn from "../columns/EmailMobileColumn";
import GuestsColumn from "../columns/GuestsColumn";
import RsvpStatusColumn from "../columns/RsvpStatusColumn";

interface Props {
  group: Group;
  showRsvpStatus: boolean;
  openModal: (group: Group) => void;
}

const TableRow = (props: Props): JSX.Element => {
  const { group, showRsvpStatus, openModal } = props;

  return (
    <tr key={group.guests[0].firstName}>
      <td>
        <GuestsColumn guests={group.guests} affiliation={group.affiliation} />
      </td>
      <td>
        <EmailMobileColumn email={group.email} phone={group.phone} />
      </td>
      <td>
        <AddressColumn group={group} />
      </td>
      <td>{showRsvpStatus && <RsvpStatusColumn guests={group.guests} />}</td>
      <td>
        <ActionColumn group={group} onEdit={(): void => openModal(group)} />
      </td>
    </tr>
  );
};

export default TableRow;

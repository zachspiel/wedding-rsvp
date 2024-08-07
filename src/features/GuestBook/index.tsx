"use client";

import { showSuccessNotification } from "@spiel-wedding/components/notifications/notifications";
import GuestBookForm from "@spiel-wedding/features/GuestBookForm";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { SectionContainer, SectionTitle } from "../../components/common";
import GuestBookMessage from "./components/GuestBookMessage";

interface Props {
  guestMessages: PublicGuestMessage[];
}

const GuestBook = ({ guestMessages }: Props): JSX.Element => {
  const saveMessage = async (messages: PublicGuestMessage[]): Promise<void> => {
    showSuccessNotification("Successfully signed guest book!");
  };

  return (
    <SectionContainer greenBackground>
      <SectionTitle id="guestBook" title="Guest Book" />
      <GuestBookForm handleSubmit={saveMessage} />

      {guestMessages.map((message) => (
        <GuestBookMessage key={message.id} message={message} />
      ))}
    </SectionContainer>
  );
};

export default GuestBook;

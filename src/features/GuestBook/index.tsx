"use client";

import { Pagination } from "@mantine/core";
import { showSuccessNotification } from "@spiel-wedding/components/notifications/notifications";
import GuestBookForm from "@spiel-wedding/features/GuestBookForm";
import { PublicGuestMessage } from "@spiel-wedding/types/Guest";
import { useState } from "react";
import { SectionContainer, SectionTitle } from "../../components/common";
import GuestBookMessage from "./components/GuestBookMessage";

interface Props {
  guestMessages: PublicGuestMessage[];
}

function chunk(array: PublicGuestMessage[]): PublicGuestMessage[][] {
  const pageSize = 6;

  if (!array.length) {
    return [];
  }

  const head = array.slice(0, pageSize);
  const tail = array.slice(pageSize);
  return [head, ...chunk(tail)];
}

const GuestBook = ({ guestMessages }: Props): JSX.Element => {
  const [activePage, setPage] = useState(1);

  const saveMessage = async (messages: PublicGuestMessage[]): Promise<void> => {
    showSuccessNotification("Successfully signed guest book!");
  };

  const paginatedMessages = chunk(guestMessages);

  const items = paginatedMessages[activePage - 1].map((message) => (
    <GuestBookMessage key={message.id} message={message} />
  ));

  return (
    <SectionContainer greenBackground>
      <SectionTitle id="guestBook" title="Guest Book" />
      <GuestBookForm handleSubmit={saveMessage} isMessageRequred={true} />
      {items}

      <Pagination
        mx="auto"
        total={paginatedMessages.length}
        value={activePage}
        onChange={setPage}
        mt="sm"
      />
    </SectionContainer>
  );
};

export default GuestBook;

"use client";

import GuestBookMessage from "./components/GuestBookMessage";
import { showSuccessNotification } from "@spiel-wedding/components/notifications/notifications";
import { useLocalStorage } from "usehooks-ts";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import { GUESTBOOK_SWR_KEY, getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import GuestBookForm from "@spiel-wedding/features/GuestBookForm";

const GuestBook = (): JSX.Element => {
  const { data } = useSWR(GUESTBOOK_SWR_KEY, getGuestMessages);
  const [localMessages] = useLocalStorage<string[]>("guestMessages", []);

  const saveMessage = async (): Promise<void> => {
    showSuccessNotification("Successfully signed guest book!");
  };

  return (
    <SectionContainer id="guestBook" greenBackground>
      <SectionTitle title="Guest Book" />
      <GuestBookForm handleSubmit={saveMessage} />

      {data?.map((message) => (
        <GuestBookMessage
          key={message.id}
          message={message}
          localMessages={localMessages}
        />
      ))}
    </SectionContainer>
  );
};

export default GuestBook;

"use client";

import GuestBookMessage from "./components/GuestBookMessage";
import { showSuccessNotification } from "@spiel-wedding/components/notifications/notifications";
import { SectionContainer, SectionTitle } from "../../components/common";
import useSWR from "swr";
import { GUESTBOOK_SWR_KEY, getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import GuestBookForm from "@spiel-wedding/features/GuestBookForm";
import { useLocalStorage } from "@mantine/hooks";
import { GuestMessage } from "@spiel-wedding/types/Guest";

const GuestBook = (): JSX.Element => {
  const { data } = useSWR(GUESTBOOK_SWR_KEY, getGuestMessages);
  const [localMessages, setLocalMessages] = useLocalStorage<string[]>({
    key: "guestMessages",
    defaultValue: [],
  });

  const saveMessage = async (messages: GuestMessage[]): Promise<void> => {
    showSuccessNotification("Successfully signed guest book!");
    setLocalMessages(messages.map((message) => message.id));
  };

  return (
    <SectionContainer greenBackground>
      <SectionTitle id="guestBook" title="Guest Book" />
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

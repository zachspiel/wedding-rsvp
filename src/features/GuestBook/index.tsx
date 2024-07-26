"use client";

import GuestBookMessage from "./components/GuestBookMessage";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { showSuccessNotification } from "@spiel-wedding/components/notifications/notifications";
import { SectionContainer, SectionTitle } from "../../components/common";
import useSWR from "swr";
import { GUESTBOOK_SWR_KEY, getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import GuestBookForm from "@spiel-wedding/features/GuestBookForm";
import { useLocalStorage } from "@mantine/hooks";
import { GuestMessage } from "@spiel-wedding/types/Guest";

const GuestBook = (): JSX.Element => {
  const { isAdminViewEnabled } = useAdminView();
  const { data, error } = useSWR(
    [GUESTBOOK_SWR_KEY, isAdminViewEnabled],
    async ([key, isAdmin]) => getGuestMessages(isAdmin)
  );
  const [localMessages, setLocalMessages] = useLocalStorage<string[]>({
    key: "guestMessages",
    defaultValue: [],
  });

  const saveMessage = async (messages: GuestMessage[]): Promise<void> => {
    showSuccessNotification("Successfully signed guest book!");
    setLocalMessages(messages.map((message) => message.id));
  };

  return (
    <SectionContainer>
      <SectionTitle id="guestBook" title="Guest Book" />
      <GuestBookForm handleSubmit={saveMessage} />

      {data?.map((message) => (
        <GuestBookMessage
          key={message.id}
          message={message}
          isAdmin={isAdminViewEnabled}
          localMessages={localMessages}
        />
      ))}
    </SectionContainer>
  );
};

export default GuestBook;

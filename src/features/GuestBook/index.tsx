"use client";

import GuestBookMessage from "./components/GuestBookMessage";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { useLocalStorage } from "usehooks-ts";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import useSWR from "swr";
import GuestBookForm from "@spiel-wedding/components/home/guestBook/components/GuestBookForm";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import {
  addMessageToGuestBook,
  GALLERY_SWR_KEY,
  getGuestMessages,
} from "@spiel-wedding/hooks/guestbook";

const GuestBook = (): JSX.Element => {
  const { data, mutate } = useSWR(GALLERY_SWR_KEY, getGuestMessages);
  const [localMessages, setLocalMessages] = useLocalStorage<string[]>(
    "guestMessages",
    [],
  );

  const saveMessage = async (
    newGuestMessage: Omit<GuestMessage, "id">,
  ): Promise<void> => {
    const guestMessage = await addMessageToGuestBook(newGuestMessage);

    if (guestMessage.length === 0) {
      showCustomFailureNotification(
        "An error occurred while signing the guest book. Please try again later!",
      );
    } else {
      await mutate();
      showSuccessNotification("Successfully signed guest book!");
      setLocalMessages([...localMessages, guestMessage[0].id]);
    }
  };

  return (
    <SectionContainer grayBackground>
      <SectionTitle title="Guest Book" id="guestBook" />
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

"use server";

import { addMessageToGuestBook } from "@spiel-wedding/hooks/guestbook";
import { GuestMessage } from "@spiel-wedding/types/Guest";

export default async function saveGuestMessage(
  guestMessage: Omit<GuestMessage, "id">
): Promise<GuestMessage> {
  return addMessageToGuestBook(guestMessage);
}

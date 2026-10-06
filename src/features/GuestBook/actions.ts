"use server";

import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import {
  removeGuestBookMessage,
  updateGuestBookMessage,
} from "@spiel-wedding/hooks/guestbook";

export async function deleteGuestMessage(id: string) {
  const removedMessage = await removeGuestBookMessage(id);
  await revalidatePage("/");
  return removedMessage;
}

export async function updateGuestMessage(id: string, message: string) {
  const updatedMessage = await updateGuestBookMessage(id, message);
  await revalidatePage("/");
  return updatedMessage;
}

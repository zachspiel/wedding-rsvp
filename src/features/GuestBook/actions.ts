"use server";

import {
  removeGuestBookMessage,
  updateGuestBookMessage,
} from "@spiel-wedding/hooks/guestbook";

export async function deleteGuestMessage(id: string) {
  return removeGuestBookMessage(id);
}

export async function updateGuestMessage(id: string, message: string) {
  return updateGuestBookMessage(id, message);
}

import {
  deleteGuestMessage,
  updateGuestMessage,
} from "@spiel-wedding/features/GuestBook/actions";
import { addMessageToGuestBook, getGuestMessages } from "@spiel-wedding/hooks/guestbook";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { describe, expect, it } from "vitest";

describe("Guest Book", () => {
  it("Gets all messages", async () => {
    const guestBook = await getGuestMessages();

    expect(guestBook !== null).toBeTruthy();
    expect(guestBook.length).toBeGreaterThan(0);
  });

  it("Creates, updates, and deletes guest message", async () => {
    const message: Omit<GuestMessage, "id"> = {
      email: "email@email.com",
      isVisible: true,
      message: "Message",
      name: "Test Name",
    };

    const newMessage = await addMessageToGuestBook(message);

    expect(newMessage !== null).toBeTruthy();
    expect(newMessage.name).toBe(message.name);
    expect(newMessage.email).toBe(message.email);
    expect(newMessage.isVisible).toBeTruthy();

    const updatedMessage = await updateGuestMessage(newMessage.id, "Updated Message");

    expect(updatedMessage !== null).toBeTruthy();
    expect(updatedMessage).toHaveLength(1);
    expect(updatedMessage[0].name).toBe(message.name);
    expect(updatedMessage[0].email).toBe(message.email);
    expect(updatedMessage[0].message).toBe("Updated Message");
    expect(updatedMessage[0].isVisible).toBeTruthy();

    const removedMessage = await deleteGuestMessage(updatedMessage[0].id);

    expect(removedMessage !== null).toBeTruthy();
  });
});

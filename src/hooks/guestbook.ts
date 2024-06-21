import { GuestMessage } from "@spiel-wedding/types/Guest";
import { supabase } from "@spiel-wedding/database/database";

const TABLE = "guestbook";

export const getGuestMessages = async (): Promise<Omit<GuestMessage, "email">[]> => {
  const { data } = await supabase
    .from(TABLE)
    .select("id,name,message,isVisible,createdAt,editedAt")
    .eq("isVisible", "true");

  return data ?? [];
};

export const addMessageToGuestBook = async (
  message: Omit<GuestMessage, "id">
): Promise<GuestMessage[]> => {
  const { data } = await supabase.from(TABLE).insert(message).select();

  return data ?? [];
};

export const updateGuestBookMessage = async (
  id: string,
  message: string
): Promise<GuestMessage[]> => {
  const { data } = await supabase
    .from(TABLE)
    .update({ message, editedAt: new Date().toISOString() })
    .eq("id", id)
    .select();

  return data ?? [];
};

export const removeGuestBookMessage = async (
  id: string
): Promise<GuestMessage | null> => {
  const { data } = await supabase
    .from(TABLE)
    .update({ isVisible: false })
    .eq("id", id)
    .select();

  return data?.[0];
};

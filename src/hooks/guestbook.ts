import { createClient } from "@spiel-wedding/database/client";
import { GuestMessage } from "@spiel-wedding/types/Guest";

const TABLE = "guestbook";

export const getGuestMessages = async (): Promise<Omit<GuestMessage, "email">[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from(TABLE)
    .select("id,name,message,isVisible,createdAt,editedAt")
    .eq("isVisible", "true");

  return data ?? [];
};

export const addMessageToGuestBook = async (
  message: Omit<GuestMessage, "id">
): Promise<GuestMessage[]> => {
  const supabase = createClient();
  const { data } = await supabase.from(TABLE).insert(message).select();

  return data ?? [];
};

export const updateGuestBookMessage = async (
  id: string,
  message: string
): Promise<GuestMessage[]> => {
  const supabase = createClient();
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
  const supabase = createClient();
  const { data } = await supabase
    .from(TABLE)
    .update({ isVisible: false })
    .eq("id", id)
    .select()
    .single();

  return data;
};

import { GuestMessage } from "@spiel-wedding/types/Guest";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { supabase } from "@spiel-wedding/database/database";

export const GUESTBOOK_SWR_KEY = "guestbook";
const TABLE = "guestbook";

export const getGuestMessages = async (isAdmin: boolean = false): Promise<Omit<GuestMessage, "email">[]> => {
  let query = supabase
    .from(TABLE)
    .select("id,name,message,isVisible,createdAt,editedAt")
    .is('deletedAt', null);

  // Conditionally add the .eq() statement
  if (!isAdmin) {
    query = query.eq("isVisible", "true");
  }

  const { data } = await query;
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
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", id)
    .select();

  return data?.[0];
};

export const toggleGuestBookMessageVisibility = async (
  id: string,
  isVisible: boolean,
): Promise<GuestMessage | null> => {
  const { data } = await supabase
    .from(TABLE)
    .update({ isVisible: !isVisible, editedAt: new Date().toISOString() })
    .eq("id", id)
    .select();

  return data?.[0];
};
import { Group, Guest, RsvpModification, RsvpResponse } from "@spiel-wedding/types/Guest";
import { supabase } from "@spiel-wedding/database/database";
import { v4 as uuid } from "uuid";
import { Tables, TablesInsert, TablesUpdate } from "@spiel-wedding/types/supabase.types";

export const GROUP_SWR_KEY = "group";
const GROUP_TABLE = "group";
const GUEST_TABLE = "guests";
const RSVP_TABLE = "rsvp_modifications";

export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase.from(GROUP_TABLE).select("*, guests(*)");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const createGroup = async (group: Group): Promise<Group | undefined> => {
  const { id, guests, rsvpModifications, ...groupData } = group;

  const { data, error } = await supabase.from(GROUP_TABLE).insert(groupData).select();

  if (error) {
    throw new Error(error.message);
  }

  const newGroup = data?.[0] ?? ({} as Group);
  const newGuests = await createGuests(guests, newGroup.id);

  return { ...newGroup, guests: newGuests };
};

export const updateGroup = async (
  group: Group,
  originalGroup: Group
): Promise<Group | undefined> => {
  const { guests, rsvpModifications, ...updatedGroup } = group;

  const updatedGuests =
    guests?.map((guest) => {
      const id = (guest?.id?.length ?? 0) === 0 ? uuid() : guest.id;

      if (guest.nameUnknown && guest.rsvp === RsvpResponse.ACCEPTED) {
        return { ...guest, id, groupId: updatedGroup.id, nameUnknown: false };
      }

      return { ...guest, id };
    }) ?? [];

  const guestIds = updatedGuests.map((guest) => guest.id);

  const removedGuests = originalGroup.guests.filter(
    (guest) => !guestIds.includes(guest.id)
  );

  if (removedGuests.length > 0) {
    await deleteGuests(removedGuests);
  }

  const remainingGuests = updatedGuests.filter((guest) => guestIds.includes(guest.id));

  const updatedGuestsResult = await upsertGuests(remainingGuests);

  const { data } = await supabase.from(GROUP_TABLE).upsert(updatedGroup).select();

  return { ...data?.[0], guests: updatedGuestsResult };
};

export const deleteGroup = async (groupId: string): Promise<Group | undefined> => {
  const { data } = await supabase.from(GROUP_TABLE).delete().eq("id", groupId).select();

  return data?.[0];
};

export const createGuests = async (
  guests: TablesInsert<"guests">[],
  groupId: string
): Promise<Guest[] | undefined> => {
  const formattedGuests = guests.map((guest) => {
    const { id, ...values } = guest;
    return { ...values, groupId: groupId };
  });

  const { data, error } = await supabase
    .from(GUEST_TABLE)
    .insert(formattedGuests)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const updateGuest = async (
  guest: Tables<"guests">
): Promise<Guest | undefined> => {
  const { data } = await supabase
    .from(GUEST_TABLE)
    .update({ ...guest })
    .eq("id", guest.id)
    .select();

  return data?.[0];
};

export const upsertGuests = async (
  guests: TablesUpdate<"guests">[]
): Promise<Guest[]> => {
  const { data } = await supabase.from(GUEST_TABLE).upsert(guests).select();

  return data ?? [];
};

export const deleteGuests = async (
  guests: TablesUpdate<"guests">[]
): Promise<Guest[]> => {
  const { data } = await supabase
    .from(GUEST_TABLE)
    .delete()
    .in(
      "id",
      guests.map((guest) => guest.id)
    )
    .select();

  return data ?? [];
};

export const addEntryToRsvpModifications = async (
  groupId: string
): Promise<RsvpModification | undefined> => {
  const { data } = await supabase.from(RSVP_TABLE).insert({ groupId }).select();

  return data?.[0];
};

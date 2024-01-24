import {
  Group,
  Guest,
  RsvpModification,
  RsvpResponse,
} from "@spiel-wedding/types/Guest";
import { supabase } from "@spiel-wedding/database/database";
import { v4 as uuid } from "uuid";
import { NewGuest, UpdateGuest } from "@spiel-wedding/types/supabase";
import addGuest from "@spiel-wedding/components/guestList/addGuestForm/AddGuest";

export const GROUP_SWR_KEY = "group";
const GROUP_TABLE = "group";
const GUEST_TABLE = "guests";
const RSVP_TABLE = "rsvp_modifications";

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await supabase.from(GROUP_TABLE).select("*, guests(*)");
  return data ?? [];
};

export const createGroup = async (group: Group): Promise<Group | undefined> => {
  const { guests, rsvpModifications, ...groupData } = group;

  const { data } = await supabase.from(GROUP_TABLE).insert(groupData).select();
  const newGuests = await createGuests(guests);

  return { ...(data?.[0] ?? {}), guests: newGuests };
};

export const updateGroup = async (group: Group): Promise<Group | undefined> => {
  const { guests, rsvpModifications, ...updatedGroup } = group;

  const updatedGuests =
    guests?.map((guest) => {
      const id = (guest?.id?.length ?? 0) === 0 ? uuid() : guest.id;

      if (guest.nameUnknown && guest.rsvp === RsvpResponse.ACCEPTED) {
        return { ...guest, id, groupId: updatedGroup.id, nameUnknown: false };
      }

      return { ...guest, id };
    }) ?? [];

  const updatedGuestsResult = await upsertGuests(updatedGuests);

  const { data } = await supabase
    .from(GROUP_TABLE)
    .upsert(updatedGroup)
    .select();

  return { ...data?.[0], guests: updatedGuestsResult };
};

export const deleteGroup = async (
  groupId: string,
): Promise<Group | undefined> => {
  const { data } = await supabase
    .from(GROUP_TABLE)
    .delete()
    .eq("id", groupId)
    .select();

  return data?.[0];
};

export const createGuests = async (
  guests: NewGuest[],
): Promise<Guest[] | undefined> => {
  const { data } = await supabase.from(GUEST_TABLE).insert(guests).select();

  return data ?? [];
};

export const updateGuest = async (
  guest: UpdateGuest,
): Promise<Guest | undefined> => {
  const { data } = await supabase
    .from(GUEST_TABLE)
    .update({ ...guest })
    .eq("id", guest.id)
    .select();

  return data?.[0];
};

export const upsertGuests = async (guests: UpdateGuest[]): Promise<Guest[]> => {
  const { data, error } = await supabase
    .from(GUEST_TABLE)
    .upsert(guests)
    .select();

  return data ?? [];
};

export const addEntryToRsvpModifications = async (
  groupId: string,
): Promise<RsvpModification | undefined> => {
  const { data } = await supabase.from(RSVP_TABLE).insert({ groupId }).select();

  return data?.[0];
};

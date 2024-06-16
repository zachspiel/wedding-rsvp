import {
  EventResponse,
  Group,
  Guest,
  RsvpModification,
  RsvpResponse,
} from "@spiel-wedding/types/Guest";
import { supabase } from "@spiel-wedding/database/database";
import { v4 as uuid } from "uuid";
import { Tables, TablesInsert, TablesUpdate } from "@spiel-wedding/types/supabase.types";
import { bulkUpsertEventResponse } from "./events";

export const GROUP_SWR_KEY = "group";
export const GROUP_TABLE = "group";
export const GUEST_TABLE = "guests";
export const RSVP_TABLE = "rsvp_modifications";

export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .select("*, guests(*, event_responses(*))");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const createGroup = async (group: Group): Promise<Group | undefined> => {
  const { group_id, guests, rsvpModifications, ...groupData } = group;

  const { data, error } = await supabase.from(GROUP_TABLE).insert(groupData).select();

  if (error) {
    throw new Error(error.message);
  }

  const newGroup = data?.[0] ?? ({} as Group);
  const newGuests = await createGuests(guests, newGroup.group_id);

  return { ...newGroup, guests: newGuests };
};

export const bulkUpdateGroups = async (groups: TablesUpdate<"group">[]) => {
  const { data: updatedGroups } = await supabase
    .from(GROUP_TABLE)
    .upsert(groups)
    .select();

  return updatedGroups;
};

export const updateGroup = async (
  group: Group,
  originalGroup: Group
): Promise<Group | undefined> => {
  const { guests, rsvpModifications, ...updatedGroup } = group;
  const eventResponses: EventResponse[] = [];

  const updatedGuests =
    guests?.map((guest) => {
      const { event_responses, ...values } = guest;
      const id = (guest?.guest_id?.length ?? 0) === 0 ? uuid() : guest.guest_id;

      if (guest.nameUnknown && guest.rsvp === RsvpResponse.ACCEPTED) {
        return {
          ...values,
          guest_id: id,
          groupId: updatedGroup.group_id,
          nameUnknown: false,
        };
      }

      eventResponses.push(...event_responses);

      return { ...values, guest_id: id };
    }) ?? [];

  const guestIds = updatedGuests.map((guest) => guest.guest_id);

  const removedGuests = originalGroup.guests.filter(
    (guest) => !guestIds.includes(guest.guest_id)
  );

  if (removedGuests.length > 0) {
    await deleteGuests(removedGuests);
  }

  if (eventResponses.length > 0) {
    await bulkUpsertEventResponse(eventResponses);
  }

  const remainingGuests = updatedGuests.filter((guest) =>
    guestIds.includes(guest.guest_id)
  );

  const updatedGuestsResult = await upsertGuests(remainingGuests);

  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .update(updatedGroup)
    .eq("group_id", group.group_id)
    .select();

  if (error) {
    return;
  }

  return { ...data?.[0], guests: updatedGuestsResult };
};

export const deleteGroup = async (groupId: string): Promise<Group | undefined> => {
  const { data } = await supabase
    .from(GROUP_TABLE)
    .delete()
    .eq("group_id", groupId)
    .select();

  return data?.[0];
};

export const createGuests = async (
  guests: TablesInsert<"guests">[],
  groupId: string
): Promise<Guest[] | undefined> => {
  const formattedGuests = guests.map((guest) => {
    const { guest_id, ...values } = guest;
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
    .eq("guest_id", guest.guest_id)
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
      "guest_id",
      guests.map((guest) => guest.guest_id)
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

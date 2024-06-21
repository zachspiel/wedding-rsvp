import {
  Event,
  EventResponse,
  Group,
  Guest,
  RsvpModification,
  RsvpResponse,
} from "@spiel-wedding/types/Guest";
import { supabase } from "@spiel-wedding/database/database";
import { v4 as uuid } from "uuid";
import { Tables, TablesUpdate } from "@spiel-wedding/types/supabase.types";
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

export const createGroup = async (
  group: Group,
  events: Event[]
): Promise<Group | undefined> => {
  const { group_id, guests, rsvpModifications, ...groupData } = group;

  const { data, error } = await supabase.from(GROUP_TABLE).insert(groupData).select();

  if (error) {
    throw new Error(error.message);
  }

  const newGroup = data?.[0] ?? ({} as Group);
  const newGuests = await createGuests(guests, newGroup.group_id, events);

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

  const updatedGuestsResult = await updateGuests(guests, group.group_id, originalGroup);

  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .update(updatedGroup)
    .eq("group_id", group.group_id)
    .select()
    .single();

  if (error) {
    return;
  }

  return { ...data, guests: updatedGuestsResult };
};

const updateGuests = async (guests: Guest[], groupId: string, originalGroup: Group) => {
  const eventResponses: EventResponse[] = guests.flatMap(
    (guest) => guest.event_responses
  );

  const updatedGuests =
    guests.map((guest) => {
      const { event_responses, ...values } = guest;
      const id = (guest?.guest_id?.length ?? 0) === 0 ? uuid() : guest.guest_id;

      if (guest.nameUnknown && guest.firstName.length > 0 && guest.lastName.length > 0) {
        return {
          ...values,
          guest_id: id,
          groupId,
          nameUnknown: false,
        };
      }

      return { ...values, guest_id: id };
    }) ?? [];

  const removedGuests = originalGroup.guests.filter(
    (guest) =>
      !updatedGuests.some((updatedGuest) => updatedGuest.guest_id === guest.guest_id)
  );

  if (removedGuests.length > 0) {
    await deleteGuests(removedGuests);
  }

  const updatedGuestsResult = await upsertGuests(updatedGuests);

  if (updatedGuestsResult.length > 0 && eventResponses.length > 0) {
    await bulkUpsertEventResponse(eventResponses);
  }

  return updatedGuestsResult;
};

export const deleteGroup = async (groupId: string): Promise<Group | undefined> => {
  const { data } = await supabase
    .from(GROUP_TABLE)
    .delete()
    .eq("group_id", groupId)
    .select()
    .single();

  return data;
};

export const createGuests = async (
  guests: Guest[],
  groupId: string,
  events: Event[]
): Promise<Guest[] | undefined> => {
  const formattedGuests = guests.map((guest) => {
    const { guest_id, event_responses, ...values } = guest;

    return { ...values, groupId: groupId };
  });

  const { data: newGuests, error } = await supabase
    .from(GUEST_TABLE)
    .insert(formattedGuests)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (newGuests.length > 0) {
    const eventResponses: EventResponse[] = events
      .filter((event) => event.auto_invite)
      .flatMap((event) => {
        return newGuests.map((guest) => ({
          response_id: uuid(),
          rsvp: RsvpResponse.NO_RESPONSE,
          eventId: event.event_id,
          guestId: guest.guest_id,
        }));
      });

    await bulkUpsertEventResponse(eventResponses);
  }

  return newGuests ?? [];
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

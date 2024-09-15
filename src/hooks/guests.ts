import { createClient } from "@spiel-wedding/database/client";
import { Event, Group, Guest } from "@spiel-wedding/types/Guest";
import { TablesUpdate } from "@spiel-wedding/types/supabase.types";
import { addEventResponseMapToGuest, createNewResponse } from "@spiel-wedding/util";
import { v4 as uuid } from "uuid";
import { bulkUpsertEventResponse, createEventResponses } from "./events";

export const GROUP_SWR_KEY = "group";
export const GROUP_TABLE = "group";
export const GUEST_TABLE = "guests";

export const getGroups = async (): Promise<Group[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .select("*, guests(*, event_responses(*))")
    .returns<Group[]>();

  if (error) {
    return [];
  }

  return (
    data?.map((group) => ({
      ...group,
      guests: addEventResponseMapToGuest(group.guests),
    })) ?? []
  );
};

export const getGroupById = async (groupId: string): Promise<Group | undefined> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .select("*, guests(*, event_responses(*))")
    .eq("group_id", groupId)
    .single();

  if (error) {
    return;
  }

  return data;
};

export const createGroup = async (
  group: Group,
  events: Event[]
): Promise<Group | undefined> => {
  const supabase = createClient();
  const { group_id, guests, ...groupData } = group;

  const { data, error } = await supabase.from(GROUP_TABLE).insert(groupData).select();

  if (error) {
    throw new Error(error.message);
  }

  const newGroup = data?.[0] ?? ({} as Group);
  const newGuests = await createGuests(guests, newGroup.group_id, events);

  return { ...newGroup, guests: newGuests };
};

export const bulkUpdateGroups = async (groups: TablesUpdate<"group">[]) => {
  const supabase = createClient();
  const { data } = await supabase.from(GROUP_TABLE).upsert(groups).select();
  return data;
};

export const updateGroup = async (
  group: Group,
  originalGroup: Group
): Promise<Group | undefined> => {
  const supabase = createClient();
  const { guests, ...updatedGroup } = group;
  const updatedGuests = await updateGuests(guests, group.group_id, originalGroup);

  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .update(updatedGroup)
    .eq("group_id", group.group_id)
    .select()
    .single();

  if (error) {
    return;
  }

  return { ...data, guests: updatedGuests };
};

const updateGuests = async (guests: Guest[], groupId: string, originalGroup: Group) => {
  const eventResponses = guests
    .flatMap((guest) => guest.event_responses)
    .filter((response) => response !== undefined);

  const updatedGuests =
    guests.map((guest) => {
      const { event_responses, responseMap, ...values } = guest;
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
  const supabase = createClient();
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
  const supabase = createClient();
  const formattedGuests = guests.map((guest) => {
    const { guest_id, event_responses, responseMap, ...values } = guest;

    return { ...values, groupId: groupId };
  });

  const { data: newGuests, error } = await supabase
    .from(GUEST_TABLE)
    .insert(formattedGuests)
    .select()
    .returns<Guest[]>();

  if (error) {
    throw new Error(error.message);
  }

  if (newGuests.length > 0) {
    const eventResponses = events
      .filter((event) => event.auto_invite)
      .flatMap((event) =>
        newGuests.map((guest) => createNewResponse(guest.guest_id, event.event_id))
      );

    await createEventResponses(eventResponses);
  }

  return newGuests ?? [];
};

export const upsertGuests = async (
  guests: TablesUpdate<"guests">[]
): Promise<Guest[]> => {
  const supabase = createClient();
  const { data } = await supabase.from(GUEST_TABLE).upsert(guests).select();

  return data ?? [];
};

export const deleteGuests = async (
  guests: TablesUpdate<"guests">[]
): Promise<Guest[]> => {
  const supabase = createClient();
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

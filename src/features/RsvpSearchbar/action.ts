"use server";

import { Group } from "@spiel-wedding/types/Guest";
import { createClient } from "@spiel-wedding/database/server";
import { GROUP_TABLE } from "@spiel-wedding/hooks/guests";
import { addEventResponseMapToGuest } from "@spiel-wedding/util";

export async function getSearchResults(name: string): Promise<Group[]> {
  const parts = name.trim().split(/\s+/);
  if (parts.length !== 2) return [];

  const supabase = await createClient();

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  const { data: groupIds, error: guestsError } = await supabase
    .from("guests")
    .select("groupId")
    .or(
      `and(firstName.ilike.%${firstName}%,lastName.ilike.%${lastName}%),and(firstName.ilike.%${lastName}%,lastName.ilike.%${firstName}%)`,
    );

  if (guestsError) {
    console.error("Error finding matching guests: ", guestsError);
    return [];
  }

  if (groupIds.length === 0) {
    return [];
  }

  const uniqueGroupIds = Array.from(new Set(groupIds.map((group) => group.groupId)));

  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .select("*, guests(*, event_responses(*))")
    .in("group_id", uniqueGroupIds)
    .overrideTypes<Group[]>();

  if (error) {
    console.error("Error fetching groups: ", error);
    return [];
  }

  return data.map((group) => ({
    ...group,
    guests: addEventResponseMapToGuest(group.guests),
  }));
}

import { createClient } from "@spiel-wedding/database/client";
import { Event, EventResponse } from "@spiel-wedding/types/Guest";
import { Database } from "@spiel-wedding/types/supabase.types";

const EVENT_TABLE = "event";
const EVENT_RESPONSE_TABLE = "event_responses";

const supabase = createClient();

export const getEvents = async (): Promise<Event[]> => {
  const { data } = await supabase
    .from(EVENT_TABLE)
    .select("*")
    .order("order", { ascending: true });

  return data ?? [];
};

export const updateEvent = async (event: Event): Promise<Event | undefined> => {
  const { data, error } = await supabase
    .from(EVENT_TABLE)
    .update({ ...event })
    .eq("event_id", event.event_id)
    .select();

  if (error) {
    console.error(`Error while updating event: ${error}`);
  }

  return data?.[0];
};

export const bulkUpsertEventResponse = async (
  eventResponses: Database["public"]["Tables"]["event_responses"]["Insert"][],
): Promise<EventResponse[] | null> => {
  if (eventResponses.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .upsert(eventResponses)
    .select();

  if (error) {
    console.error(`Error while bulk upserting event: ${error}`);
  }

  return data;
};

export const createEventResponses = async (
  eventResponses: Database["public"]["Tables"]["event_responses"]["Insert"][],
): Promise<EventResponse[] | null> => {
  const { data } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .insert(eventResponses)
    .select();

  return data;
};

export const deleteEventResponse = async (
  responseId: string,
): Promise<EventResponse | null> => {
  const { data } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .delete()
    .eq("response_id", responseId)
    .select();

  return data?.[0];
};

export const deleteEventResponses = async (
  responseIds: string[],
): Promise<EventResponse[] | null> => {
  const { data } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .delete()
    .in("response_id", responseIds)
    .select();

  return data;
};

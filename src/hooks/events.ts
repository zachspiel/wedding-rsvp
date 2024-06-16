import { supabase } from "@spiel-wedding/database/database";
import { Event, EventResponse, RsvpResponse } from "@spiel-wedding/types/Guest";
import { Database } from "@spiel-wedding/types/supabase.types";

const EVENT_TABLE = "event";
const EVENT_RESPONSE_TABLE = "event_responses";

export const getEvents = async (): Promise<Event[]> => {
  const { data } = await supabase.from(EVENT_TABLE).select("*");

  return data ?? [];
};

export const updateEvent = async (event: Event): Promise<Event | null> => {
  const { data } = await supabase
    .from(EVENT_TABLE)
    .update({ ...event })
    .eq("event_id", event.event_id)
    .select();

  return data?.[0];
};

export const updateEventResponse = async (
  responseId: string,
  response: RsvpResponse
): Promise<EventResponse | null> => {
  const { data } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .update({ rsvp: response })
    .eq("response_id", responseId)
    .select();

  return data?.[0];
};

export const bulkUpsertEventResponse = async (
  eventResponses: Database["public"]["Tables"]["event_responses"]["Insert"][]
): Promise<EventResponse[] | null> => {
  const { data, error } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .upsert(eventResponses)
    .select();

  console.log(error);

  return data;
};

export const createEventResponse = async (
  eventResponse: Database["public"]["Tables"]["event_responses"]["Insert"]
): Promise<Event | null> => {
  const { data } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .insert({ ...eventResponse })
    .select();

  return data?.[0];
};

export const deleteEventResponse = async (
  responseId: string
): Promise<EventResponse | null> => {
  const { data } = await supabase
    .from(EVENT_RESPONSE_TABLE)
    .delete()
    .eq("response_id", responseId)
    .select();

  return data?.[0];
};

"use client";

import { Button, Checkbox, Flex, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GROUP_SWR_KEY, bulkUpdateGroups } from "@spiel-wedding/hooks/guests";
import {
  showFailureNotification,
  showSuccessNotification,
} from "../notifications/notifications";
import { Group, Event, RsvpResponse, EventResponse } from "@spiel-wedding/types/Guest";
import { mutate } from "swr";
import { useEffect } from "react";
import { bulkUpsertEventResponse } from "@spiel-wedding/hooks/events";

import { v4 as uuid } from "uuid";

interface Props {
  groups: Group[];
  events: Event[];
}

interface FormValues {
  saveTheDateSent: boolean;
  events: Record<string, RsvpResponse>;
}

const BulkEditGroups = ({ groups, events }: Props) => {
  const form = useForm<FormValues>({
    initialValues: {
      saveTheDateSent: false,
      events: {},
    },
  });

  useEffect(() => {
    const eventMap: Record<string, RsvpResponse> = {};

    events.forEach((event) => {
      eventMap[event.event_id] = RsvpResponse.NO_RESPONSE;
    });

    form.setInitialValues({ ...form.values, events: eventMap });
  }, []);

  const handleSubmit = async ({ saveTheDateSent, events }: FormValues) => {
    const result = await bulkUpdateGroups(
      groups.map((group) => {
        const { guests, rsvpModifications, ...values } = group;
        return { ...values, saveTheDateSent };
      })
    );

    if (result) {
      showSuccessNotification("Successfully updated groups!");
      await mutate(GROUP_SWR_KEY);
    } else {
      showFailureNotification();
    }

    if (Object.values(events).length > 0) {
      const guests = groups.flatMap((group) => group.guests);

      const responses = guests.flatMap((guest) => {
        const updatedResponses: EventResponse[] = guest.event_responses.map(
          (response) => {
            if (events[response.eventId]) {
              return { ...response, rsvp: events[response.eventId] };
            }

            return { ...response };
          }
        );

        Object.keys(events).forEach((eventId) => {
          if (!updatedResponses.some((response) => response.eventId === eventId)) {
            updatedResponses.push({
              response_id: uuid(),
              eventId,
              guestId: guest.guest_id,
              rsvp: events[eventId],
            });
          }
        });

        return updatedResponses;
      });

      const result = await bulkUpsertEventResponse(responses);

      if (result?.length === responses.length) {
        showSuccessNotification("Successfully updated responses!");
      } else {
        showFailureNotification();
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Checkbox
        label={"Save the Date Sent"}
        {...form.getInputProps("saveTheDateSent")}
        mb="md"
      />

      {events.map((event) => {
        return (
          <Select
            key={event.event_id}
            label={event.title}
            data={[
              RsvpResponse.ACCEPTED,
              RsvpResponse.DECLINED,
              RsvpResponse.NO_RESPONSE,
            ]}
            {...form.getInputProps(`events.${event.event_id}`)}
            mb="md"
          />
        );
      })}

      <Flex justify="end">
        <Button type="submit">Submit</Button>
      </Flex>
    </form>
  );
};

export default BulkEditGroups;

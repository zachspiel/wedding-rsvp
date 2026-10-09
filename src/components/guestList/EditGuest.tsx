"use client";

import {
  Accordion,
  Button,
  Flex,
  Group as MGroup,
  Radio,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  GuestAffiliationSelection,
  GuestInput,
  MailingAddressForm,
} from "@spiel-wedding/components/form";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { createEventResponses, deleteEventResponse } from "@spiel-wedding/hooks/events";
import { GROUP_SWR_KEY, updateGroup } from "@spiel-wedding/hooks/guests";
import {
  Event,
  EventResponse,
  Group,
  Guest,
  RsvpResponse,
} from "@spiel-wedding/types/Guest";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { ReactElement } from "react";
import { useSWRConfig } from "swr";
import RsvpStatus from "./RsvpStatus";

interface Props {
  group: Group;
  events: Event[];
  close: () => void;
}

const EditGuest = ({ group, events, close }: Props): ReactElement => {
  const { mutate } = useSWRConfig();

  const form = useForm<Group>({
    initialValues: group,
    validate: {
      guests: {
        firstName: (value: string) => value.length < 2,
        lastName: (value: string) => value.length < 2,
      },
    },
  });

  const handleSubmit = async () => {
    const updatedGroup = await updateGroup(form.getTransformedValues(), group);

    if (updatedGroup) {
      showSuccessNotification("Successfully updated guest");
      await mutate(GROUP_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  const submitAndClose = async () => {
    await handleSubmit();
    close();
  };

  const addGuestToEvent = async (guest: Guest, event: Event) => {
    const removedEvent = await createEventResponses([
      {
        eventId: event.event_id,
        guestId: guest.guest_id,
        rsvp: RsvpResponse.NO_RESPONSE,
      },
    ]);

    if (removedEvent) {
      await mutate("events");
      showSuccessNotification("Guest added to event");
    } else {
      showFailureNotification();
    }
  };

  const removeGuestFromEvent = async (eventResponse: EventResponse) => {
    const result = await deleteEventResponse(eventResponse.response_id);

    if (result) {
      await mutate("events");
      showSuccessNotification("Guest removed from event");
    } else {
      showFailureNotification();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Tabs defaultValue="guestInfo">
        <Tabs.List>
          <Tabs.Tab value="guestInfo">Guest Info</Tabs.Tab>
          <Tabs.Tab value="contactInfo">Contact Info & Invitations</Tabs.Tab>
          <Tabs.Tab value="rsvpStatus">RSVP Status</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="guestInfo" pt="xs">
          {form.values.guests.map((guest, index) => {
            return (
              <GuestInput
                form={form}
                groupType="family"
                index={index}
                key={`${guest.guest_id}-edit-guest`}
                events={events}
              />
            );
          })}

          <TextInput label="Table" {...form.getInputProps("table")} />

          <GuestAffiliationSelection form={form} />

          <Radio.Group
            name="invited"
            label="Invited?"
            mt="lg"
            value={form.values.invited ? "definitely" : "maybe"}
            onChange={(val) => form.setFieldValue("invited", val === "definitely")}
          >
            <MGroup>
              <Radio value="definitely" label="Definitely" />
              <Radio value="maybe" label="Maybe" />
            </MGroup>
          </Radio.Group>
        </Tabs.Panel>

        <Tabs.Panel value="contactInfo" pt="xs">
          <MailingAddressForm form={form} />
          <Radio.Group
            {...form.getInputProps("saveTheDateSent")}
            value={form.values.saveTheDateSent ? "yes" : "no"}
            onChange={(value): void =>
              form.setFieldValue("saveTheDateSent", value === "yes")
            }
            name="saveTheDateSent"
            label="Sent save the date?"
            pt="lg"
          >
            <MGroup>
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </MGroup>
          </Radio.Group>
          <Radio.Group
            {...form.getInputProps("inviteSent")}
            value={form.values.inviteSent ? "yes" : "no"}
            onChange={(value): void => form.setFieldValue("inviteSent", value === "yes")}
            name="inviteSent"
            label="Sent wedding invitation?"
            pt="lg"
          >
            <MGroup>
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </MGroup>
          </Radio.Group>
        </Tabs.Panel>

        <Tabs.Panel value="rsvpStatus" pt="xs">
          {form.values.guests.map((guest, index) => (
            <Accordion key={`${guest.guest_id}-rsvp-status`} mb="md">
              <Title order={4} fw="normal">
                {guest.firstName} {guest.lastName}
                {guest.nameUnknown && "Guest"}
              </Title>
              {guest.event_responses.map((eventResponse, responseIndex) => {
                const matchingEvent = events.filter(
                  (event) => event.event_id === eventResponse.eventId,
                )[0];

                return (
                  <Accordion.Item
                    key={eventResponse.response_id}
                    value={matchingEvent.event_id}
                  >
                    <Accordion.Control>{matchingEvent.title}</Accordion.Control>
                    <Accordion.Panel>
                      <RsvpStatus
                        guest={guest}
                        index={index}
                        responseIndex={responseIndex}
                        form={form}
                        key={`${guest.guest_id}-rsvp-status`}
                      />

                      <Button
                        color="red"
                        leftSection={<IconTrash />}
                        onClick={() => removeGuestFromEvent(eventResponse)}
                      >
                        Remove guest
                      </Button>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}

              <Flex direction="column">
                {events
                  .filter(
                    (event) =>
                      !guest.event_responses
                        .map((response) => response.eventId)
                        .includes(event.event_id),
                  )
                  .map((event) => {
                    return (
                      <div key={`add=${guest.guest_id}-to-${event.event_id}`}>
                        <Button
                          leftSection={<IconPlus />}
                          mt="md"
                          onClick={() => addGuestToEvent(guest, event)}
                        >
                          Add to {event.title}
                        </Button>
                      </div>
                    );
                  })}
              </Flex>
            </Accordion>
          ))}
        </Tabs.Panel>
      </Tabs>

      <MGroup justify="right" mt="lg">
        <Button
          variant="outline"
          mr="md"
          type="submit"
          size="md"
          disabled={!form.isDirty()}
        >
          Save
        </Button>

        <Button
          onClick={() => form.onSubmit(() => submitAndClose())()}
          size="md"
          disabled={!form.isDirty()}
        >
          Save & Close
        </Button>
      </MGroup>
    </form>
  );
};

export default EditGuest;

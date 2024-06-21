"use client";

import { isNotEmpty, useForm } from "@mantine/form";
import { Event, EventResponse, Group as Party, RsvpResponse } from "../../types/Guest";
import { getGuestsForEvent } from "@spiel-wedding/util";
import {
  Button,
  CheckIcon,
  Combobox,
  Grid,
  Group,
  Input,
  Pill,
  PillsInput,
  ScrollArea,
  Select,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { STATES } from "@spiel-wedding/components/form/states";
import { useState } from "react";
import {
  bulkUpsertEventResponse,
  deleteEventResponses,
  updateEvent,
} from "@spiel-wedding/hooks/events";
import { v4 as uuid } from "uuid";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";

interface Props {
  event: Event;
  groups: Party[];
}

interface EditEventForm extends Event {
  guests: string[];
}

const EditEvent = ({ event, groups }: Props) => {
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const getInitialValues = (): EditEventForm => {
    const guests = groups.flatMap((group) => group.guests);
    const guestsInvitedToEvent = getGuestsForEvent(event, guests).map(
      ({ guest_id }) => guest_id
    );

    return {
      ...event,
      guests: guestsInvitedToEvent,
    };
  };

  const form = useForm<EditEventForm>({
    initialValues: getInitialValues(),
    validate: {
      title: isNotEmpty("Please enter a title for the event"),
      date: isNotEmpty("Please select a date"),
    },
  });

  const handleSubmit = async (formValues: EditEventForm) => {
    const { guests, ...updatedEvent } = formValues;
    const allGuests = groups.flatMap((group) => group.guests);
    const guestsForEvent = getGuestsForEvent(event, allGuests).map(
      (guest) => guest.guest_id
    );

    const responsesToRemove = getGuestsForEvent(event, allGuests)
      .filter((guest) => !guests.includes(guest.guest_id))
      .filter((guest) =>
        guest.event_responses.some((response) => response.eventId === event.event_id)
      )
      .flatMap(
        (guest) =>
          guest.event_responses.find(
            (response) => response.eventId === event.event_id
          ) as EventResponse
      );
    const newEventResponses: EventResponse[] = guests
      .filter((guest) => !guestsForEvent.includes(guest))
      .map((guestId) => ({
        response_id: uuid(),
        guestId,
        eventId: event.event_id,
        rsvp: RsvpResponse.NO_RESPONSE,
      }));

    const updateEventResult = await updateEvent(updatedEvent);

    const removedResponses = await deleteEventResponses(
      responsesToRemove.map((response) => response.response_id)
    );
    const newResponses = await bulkUpsertEventResponse(newEventResponses);

    if (
      updateEventResult !== null &&
      removedResponses !== null &&
      newResponses !== null
    ) {
      showSuccessNotification("Updated event");
      await revalidatePage("/events");
    } else {
      showFailureNotification();
    }
  };

  const handleValueSelect = (val: string) => {
    setSearch("");

    const guestIds = val.split(",");

    form.setFieldValue("guests", (current) => {
      const updatedValue = current.filter((id) => !guestIds.includes(id));

      guestIds.forEach((guestId) => {
        if (!current.includes(guestId)) {
          updatedValue.push(guestId);
        }
      });

      return updatedValue;
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <TextInput
            label="Emoji"
            placeholder="Enter emoji"
            {...form.getInputProps("emoji")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 10 }}>
          <TextInput
            label="Title"
            placeholder="Enter event title"
            {...form.getInputProps("title")}
          />
        </Grid.Col>
      </Grid>
      {/**<DateInput label="Date" {...form.getInputProps("date")} />**/}

      <TextInput
        label="Time"
        placeholder="Enter time of event"
        {...form.getInputProps("time")}
      />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Street Address"
            name="streetAddress"
            {...form.getInputProps("address1")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Apt / Floor"
            name="streetAddress2"
            {...form.getInputProps("address2")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput label="City" name="city" {...form.getInputProps("city")} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            label="State"
            name="State"
            data={STATES}
            {...form.getInputProps("state")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput label="Zip Code" name="postal" {...form.getInputProps("postal")} />
        </Grid.Col>
      </Grid>

      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
        position="bottom"
      >
        <Combobox.DropdownTarget>
          <PillsInput
            pointer
            onClick={() => combobox.toggleDropdown()}
            my="md"
            label="Guests Invited to Event"
          >
            <Pill.Group>
              {form.values.guests.length > 0 ? (
                <Pill>{form.values.guests.length} guests invited</Pill>
              ) : (
                <Input.Placeholder>Pick one or more values</Input.Placeholder>
              )}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  onChange={(event) => {
                    combobox.openDropdown();
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            <ScrollArea.Autosize type="scroll" mah={300} p={2}>
              {groups
                .filter((group) =>
                  group.guests.some((guest) =>
                    `${guest.firstName} ${guest.lastName}`
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                )
                .map((group) => {
                  const isSelected = group.guests.some((guest) =>
                    form.values.guests.includes(guest.guest_id)
                  );
                  return (
                    <Combobox.Option
                      value={group.guests.map((guest) => guest.guest_id).join(",")}
                      key={`${group.group_id}-option`}
                      active={isSelected}
                    >
                      <Group gap="sm">
                        {isSelected ? <CheckIcon size={12} /> : null}

                        {group.guests.map((guest) => {
                          return (
                            <Group gap={7} key={`${guest.guest_id}-row`}>
                              {guest.nameUnknown && (
                                <Text c="dimmed" size="sm">
                                  Guest
                                </Text>
                              )}
                              {!guest.nameUnknown && (
                                <span>{`${guest.firstName} ${guest.lastName}`}</span>
                              )}
                            </Group>
                          );
                        })}
                      </Group>
                    </Combobox.Option>
                  );
                })}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <Group justify="flex-end" style={{ zIndex: 1 }}>
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
};

export default EditEvent;

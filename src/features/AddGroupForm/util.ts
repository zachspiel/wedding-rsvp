import { UseFormReturnType } from "@mantine/form";
import {
  Event,
  EventResponse,
  Group,
  Guest,
  GuestAffiliation,
  RelationshipType,
  RsvpResponse,
} from "@spiel-wedding/types/Guest";
import { v4 as uuid } from "uuid";

const createDefaultGroup = (events: Event[]): Group => {
  const groupId = uuid();
  const guestId = uuid();

  return {
    group_id: groupId,
    email: "",
    guests: [
      {
        guest_id: uuid(),
        groupId: groupId,
        title: "",
        firstName: "",
        lastName: "",
        nameUnknown: false,
        rsvp: RsvpResponse.NO_RESPONSE,
        event_responses: getDefaultEventsForGuest(guestId, events),
        relationshipType: RelationshipType.PRIMARY,
      },
    ],
    affiliation: GuestAffiliation.NONE,
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    message: "",
    invited: true,
    inviteSent: false,
    saveTheDateSent: false,
    dietaryRestrictions: "",
  };
};

const createGuest = (form: UseFormReturnType<Group>, events: Event[]): Partial<Guest> => {
  const id = uuid();

  return {
    guest_id: id,
    groupId: form.values.group_id,
    firstName: "",
    lastName: "",
    rsvp: RsvpResponse.NO_RESPONSE,
    event_responses: getDefaultEventsForGuest(id, events),
    relationshipType: RelationshipType.PARTNER,
    nameUnknown: false,
  };
};

const getDefaultEventsForGuest = (guestId: string, events: Event[]) => {
  return events
    .filter((event) => event.auto_invite)
    .map((event) => ({
      response_id: uuid(),
      eventId: event.event_id,
      guestId: guestId,
      rsvp: RsvpResponse.NO_RESPONSE,
    }));
};

const addPartnerToGuests = (form: UseFormReturnType<Group>, events: Event[]): void => {
  const newGuest = createGuest(form, events);

  form.insertListItem(
    "guests",
    {
      ...newGuest,
      relationshipType: RelationshipType.PARTNER,
    },
    1
  );
};

const addChildToGuests = (form: UseFormReturnType<Group>, events: Event[]): void => {
  const newGuest = createGuest(form, events);

  form.insertListItem("guests", {
    ...newGuest,
    relationshipType: RelationshipType.CHILD,
  });
};

const createDefaultEventResponse = (): EventResponse => ({
  response_id: uuid(),
  guestId: "",
  eventId: uuid(),
  rsvp: RsvpResponse.NO_RESPONSE,
});

export {
  addChildToGuests,
  addPartnerToGuests,
  createDefaultEventResponse,
  createDefaultGroup,
  createGuest,
};

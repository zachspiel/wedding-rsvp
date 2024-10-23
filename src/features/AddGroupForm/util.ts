import { UseFormReturnType } from "@mantine/form";
import {
  Event,
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
        event_responses: getDefaultEventsForGuest(guestId, events),
        relationshipType: RelationshipType.PRIMARY,
        responseMap: {},
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

const createGuest = (groupId: string, events: Event[]): Partial<Guest> => {
  const id = uuid();

  return {
    guest_id: id,
    groupId: groupId,
    firstName: "",
    lastName: "",
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
  const newGuest = createGuest(form.values.group_id, events);

  form.insertListItem(
    "guests",
    {
      ...newGuest,
      relationshipType: RelationshipType.PARTNER,
    },
    1,
  );
};

const addChildToGuests = (form: UseFormReturnType<Group>, events: Event[]): void => {
  const newGuest = createGuest(form.values.group_id, events);

  form.insertListItem("guests", {
    ...newGuest,
    relationshipType: RelationshipType.CHILD,
  });
};

export { addChildToGuests, addPartnerToGuests, createDefaultGroup, createGuest };

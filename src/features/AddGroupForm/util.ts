import { UseFormReturnType } from "@mantine/form";
import {
  Group,
  Guest,
  GuestAffiliation,
  RelationshipType,
  RsvpResponse,
} from "@spiel-wedding/types/Guest";
import { v4 as uuid } from "uuid";

const createDefaultGroup = (): Group => {
  const groupId = uuid();

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
        event_responses: [],
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
  };
};

const createGuest = (form: UseFormReturnType<Group>): Partial<Guest> => {
  return {
    groupId: form.values.group_id,
    firstName: "",
    lastName: "",
    rsvp: RsvpResponse.NO_RESPONSE,
    relationshipType: RelationshipType.PARTNER,
    nameUnknown: false,
  };
};

const addPartnerToGuests = (form: UseFormReturnType<Group>): void => {
  const newGuest = createGuest(form);

  form.insertListItem(
    "guests",
    {
      ...newGuest,
      relationshipType: RelationshipType.PARTNER,
    },
    1
  );
};

const addChildToGuests = (form: UseFormReturnType<Group>): void => {
  const newGuest = createGuest(form);

  form.insertListItem("guests", {
    ...newGuest,
    relationshipType: RelationshipType.CHILD,
  });
};

export { createDefaultGroup, addPartnerToGuests, addChildToGuests };

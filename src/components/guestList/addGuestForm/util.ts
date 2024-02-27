import { UseFormReturnType } from "@mantine/form";
import { Group, RelationshipType, RsvpResponse } from "@spiel-wedding/types/Guest";

const addPartnerToGuests = (form: UseFormReturnType<Group>): void => {
  form.insertListItem(
    "guests",
    {
      groupId: form.values.id,
      firstName: "",
      lastName: "",
      rsvp: RsvpResponse.NO_RESPONSE,
      relationshipType: RelationshipType.PARTNER,
    },
    1
  );
};

const addChildToGuests = (form: UseFormReturnType<Group>): void => {
  form.insertListItem("guests", {
    groupId: form.values.id,
    firstName: "",
    lastName: "",
    rsvp: RsvpResponse.NO_RESPONSE,
    relationshipType: RelationshipType.CHILD,
  });
};

export { addPartnerToGuests, addChildToGuests };

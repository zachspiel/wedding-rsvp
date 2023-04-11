import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { RsvpResonse, RelationshipType, Group } from "../../types/Guest";

const addPartnerToGuests = (form: UseFormReturnType<Group>): void => {
  form.insertListItem(
    "guests",
    {
      firstName: "",
      lastName: "",
      rsvp: RsvpResonse.NO_RESPONSE,
      relationshipType: RelationshipType.PARTNER,
    },
    1
  );
};

const addChildToGuests = (form: UseFormReturnType<Group>): void => {
  form.insertListItem("guests", {
    firstName: "",
    lastName: "",
    rsvp: RsvpResonse.NO_RESPONSE,
    relationshipType: RelationshipType.CHILD,
  });
};

const showSuccessNotification = (message: string): void => {
  notifications.show({
    title: "Success",
    message: message,
    color: "green",
  });
};

const showFailureNotification = (): void => {
  notifications.show({
    title: "Error",
    message: "Oh no! Better call Zach, and bring some alcohol 😭",
    color: "red",
  });
};

export {
  addPartnerToGuests,
  addChildToGuests,
  showSuccessNotification,
  showFailureNotification,
};

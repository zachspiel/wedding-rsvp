"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  SegmentedControl,
  Center,
  Group as MGroup,
  Radio,
  Modal,
} from "@mantine/core";
import GuestInput from "./GuestInput";
import MailingAddressForm from "@spiel-wedding/components/form/MailingAddressForm";
import { ref, set } from "@firebase/database";
import GuestAffiliationSelection from "./GuestAffiliationSelection";
import { useDisclosure } from "@mantine/hooks";
import {
  showSuccessNotification,
  showFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { database } from "@spiel-wedding/database/database";
import {
  RelationshipType,
  Group,
  GuestAffiliation,
  RsvpResonse,
} from "@spiel-wedding/types/Guest";
import { addPartnerToGuests, addChildToGuests } from "./util";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

const DEFAULT_GROUP: Group = {
  id: uuidv4(),
  email: "",
  phone: "",
  guests: [
    {
      title: "",
      firstName: "",
      lastName: "",
      nameUnknown: false,
      rsvp: RsvpResonse.NO_RESPONSE,
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
  dietaryRestrictions: "",
  invited: true,
  inviteSent: false,
  saveTheDateSent: false,
};

const AddGuest = (): JSX.Element => {
  const [groupType, setGroupType] = useState("single");
  const [isInvited, setIsInvited] = useState("definitely");
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Group>({
    initialValues: DEFAULT_GROUP,
    validate: {
      guests: {
        firstName: (value, group, path) => isNameInvalid(value, group, path),
        lastName: (value, group, path) => isNameInvalid(value, group, path),
      },
    },
  });

  const isNameInvalid = (value: string, values: Group, path: string): boolean => {
    const index = Number(path.split(".")[1]);
    if (!values.guests[index].nameUnknown) {
      return value.length === 0;
    }

    return false;
  };

  useEffect(() => {
    if (groupType === "single") {
      removeGuestsFromGroup([RelationshipType.PARTNER, RelationshipType.CHILD]);
    } else if (groupType === "couple") {
      removeGuestsFromGroup([RelationshipType.CHILD]);
      if (form.values.guests.length === 1) {
        addPartnerToGuests(form);
      }
    } else {
      if (form.values.guests.length === 1) {
        addPartnerToGuests(form);
      }

      addChildToGuests(form);
    }
  }, [groupType]);

  useEffect(() => {
    form.setFieldValue("invited", isInvited === "definitely");
  }, [isInvited]);

  const removeGuestsFromGroup = (filters: RelationshipType[]): void => {
    const totalGuests = form.values.guests.length - 1;

    for (let index = totalGuests; index > 0; index--) {
      if (filters.includes(form.values.guests[index].relationshipType)) {
        form.removeListItem("guests", index);
      }
    }
  };

  const handleSubmit = (): void => {
    const newGroupRef = ref(database, "groups/" + form.values.id);

    set(newGroupRef, {
      ...form.values,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        showSuccessNotification(
          `Successfully added ${form.values.guests.length} guests 🎉!`,
        );
      })
      .catch(() => {
        showFailureNotification();
      });

    form.reset();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Guest" size="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Center>
            <SegmentedControl
              value={groupType}
              onChange={setGroupType}
              data={[
                { value: "single", label: "SINGLE" },
                { value: "couple", label: "COUPLE" },
                { value: "family", label: "FAMILY" },
              ]}
            />
          </Center>

          {form.values.guests.map((guest, index) => {
            return (
              <GuestInput form={form} groupType={groupType} index={index} key={index} />
            );
          })}

          <GuestAffiliationSelection form={form} />

          <Radio.Group
            name="invited"
            label="Invited?"
            mt="lg"
            value={isInvited}
            onChange={setIsInvited}
          >
            <MGroup>
              <Radio value="definitely" label="Definitely" />
              <Radio value="maybe" label="Maybe" />
            </MGroup>
          </Radio.Group>

          <MailingAddressForm form={form} />

          <MGroup position="right" mt="xl">
            <Button variant="subtle" size="md" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" size="md">
              Add Guest
            </Button>
          </MGroup>
        </form>
      </Modal>

      <Button variant="outline" onClick={open}>
        Add Guest
      </Button>
    </>
  );
};

export default AddGuest;

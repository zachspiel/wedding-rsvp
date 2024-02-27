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
import GuestAffiliationSelection from "./GuestAffiliationSelection";
import { useDisclosure } from "@mantine/hooks";
import {
  showSuccessNotification,
  showFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import {
  RelationshipType,
  GuestAffiliation,
  RsvpResponse,
  Group,
} from "@spiel-wedding/types/Guest";
import { addPartnerToGuests, addChildToGuests } from "./util";
import { useEffect, useState } from "react";
import { createGroup, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import { v4 as uuid } from "uuid";
import { useSWRConfig } from "swr";

const createDefaultGroup = (): Group => {
  const groupId = uuid();

  return {
    id: groupId,
    email: "",
    phone: "",
    guests: [
      {
        id: uuid(),
        groupId: groupId,
        title: "",
        firstName: "",
        lastName: "",
        nameUnknown: false,
        rsvp: RsvpResponse.NO_RESPONSE,
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
};

const AddGuest = (): JSX.Element => {
  const [groupType, setGroupType] = useState("single");
  const [isInvited, setIsInvited] = useState("definitely");
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate } = useSWRConfig();

  const form = useForm<Group>({
    initialValues: createDefaultGroup(),
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
      if (
        filters.includes(form.values.guests[index].relationshipType as RelationshipType)
      ) {
        form.removeListItem("guests", index);
      }
    }
  };

  const handleSubmit = async () => {
    const { data: newGroup, error } = await createGroup(form.values);

    if (error) {
      showFailureNotification();
    } else if (newGroup) {
      showSuccessNotification(
        `Successfully added ${form.values.guests.length} guests 🎉!`
      );
      await mutate(GROUP_SWR_KEY);
    }

    form.reset();
    form.setInitialValues(createDefaultGroup());
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
              <GuestInput
                form={form}
                groupType={groupType}
                index={index}
                key={`${guest.id}-guest-input`}
              />
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

          <MGroup justify="right" mt="xl">
            <Button variant="subtle" size="md" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" size="md">
              Add Group
            </Button>
          </MGroup>
        </form>
      </Modal>

      <Button variant="outline" onClick={open}>
        Add Group
      </Button>
    </>
  );
};

export default AddGuest;

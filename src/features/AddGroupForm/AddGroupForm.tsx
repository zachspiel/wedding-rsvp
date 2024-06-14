"use client";

import {
  Group as MGroup,
  Modal,
  Center,
  SegmentedControl,
  Radio,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  showSuccessNotification,
  showCustomFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { createGroup, GROUP_SWR_KEY } from "@spiel-wedding/hooks/guests";
import { Group, RelationshipType } from "@spiel-wedding/types/Guest";
import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import {
  GuestAffiliationSelection,
  GuestInput,
  MailingAddressForm,
} from "@spiel-wedding/components/form";
import { addPartnerToGuests, addChildToGuests, createDefaultGroup } from "./util";

const AddGroupForm = () => {
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
      if (filters.includes(form.values.guests[index].relationshipType)) {
        form.removeListItem("guests", index);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await createGroup(form.values);
      showSuccessNotification(
        `Successfully added ${form.values.guests.length} guests 🎉!`
      );
      await mutate(GROUP_SWR_KEY);
    } catch (error) {
      showCustomFailureNotification(`${error}`);
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
                key={`${guest.guest_id}-guest-input-${index}`}
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

      <Button onClick={open}>Add Group</Button>
    </>
  );
};

export default AddGroupForm;

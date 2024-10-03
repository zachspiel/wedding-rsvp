"use client";

import {
  Button,
  Center,
  Group as MGroup,
  Modal,
  Radio,
  SegmentedControl,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import {
  GuestAffiliationSelection,
  GuestInput,
  MailingAddressForm,
} from "@spiel-wedding/components/form";
import {
  showCustomFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { createGroup } from "@spiel-wedding/hooks/guests";
import { Event, Group, RelationshipType } from "@spiel-wedding/types/Guest";
import { useEffect, useState } from "react";
import { addChildToGuests, addPartnerToGuests, createDefaultGroup } from "./util";

interface Props {
  events: Event[];
}

const AddGroupForm = ({ events }: Props) => {
  const [groupType, setGroupType] = useState("single");
  const [isInvited, setIsInvited] = useState("definitely");
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Group>({
    initialValues: createDefaultGroup(events),
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
        addPartnerToGuests(form, events);
      }
    } else {
      if (form.values.guests.length === 1) {
        addPartnerToGuests(form, events);
      }

      addChildToGuests(form, events);
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
      await createGroup(form.values, events);
      showSuccessNotification(
        `Successfully added ${form.values.guests.length} guests 🎉!`
      );
      await revalidatePage("/guestList");
    } catch (error) {
      showCustomFailureNotification(`${error}`);
    }

    form.reset();
    form.setInitialValues(createDefaultGroup(events));
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Guest" size="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Center my="md">
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
                events={events}
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

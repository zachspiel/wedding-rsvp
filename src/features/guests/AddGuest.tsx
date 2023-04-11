/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useForm } from "@mantine/form";
import {
  Textarea,
  Button,
  SegmentedControl,
  Center,
  Group,
  Radio,
  Modal,
} from "@mantine/core";
import {
  Group as RsvpGroup,
  GuestAffiliation,
  RelationshipType,
  RsvpResonse,
} from "../../types/Guest";
import GuestInput from "./GuestInput";
import {
  addPartnerToGuests,
  addChildToGuests,
  showFailureNotification,
  showSuccessNotification,
} from "./util";
import MailingAddressForm from "./MailingAddressForm";
import { push, ref, set } from "@firebase/database";
import { database } from "../database/database";
import GuestAffiliationSelection from "./GuestAffiliationSelection";
import { useDisclosure } from "@mantine/hooks";

const DEFAULT_GROUP: RsvpGroup = {
  id: "",
  email: "",
  phone: "",
  guests: [
    {
      title: "",
      firstName: "",
      lastName: "",
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
  invited: true,
  inviteSent: false,
  saveTheDateSent: false,
};

const AddGuest = (): JSX.Element => {
  const [groupType, setGroupType] = React.useState("single");
  const [isInvited, setIsInvited] = React.useState("definitely");
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<RsvpGroup>({
    initialValues: DEFAULT_GROUP,
    validate: {
      guests: {
        firstName: (value: string) => value.length < 2,
        lastName: (value: string) => value.length < 2,
      },
    },
  });

  React.useEffect(() => {
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

  React.useEffect(() => {
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
    const postListRef = ref(database, "guests");
    const newPostRef = push(postListRef);
    set(newPostRef, {
      ...form.values,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        showSuccessNotification(
          `Successfully added ${form.values.guests.length} guests 🎉!`
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
              <GuestInput
                form={form}
                groupType={groupType}
                index={index}
                key={index}
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
            <Group>
              <Radio value="definitely" label="Definitely" />
              <Radio value="maybe" label="Maybe" />
            </Group>
          </Radio.Group>

          <MailingAddressForm form={form} />

          <Textarea
            mt="md"
            label="Message"
            placeholder="Leave a message"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            {...form.getInputProps("message")}
          />

          <Group position="right" mt="xl">
            <Button variant="subtle" size="md" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" size="md">
              Add Guest
            </Button>
          </Group>
        </form>
      </Modal>

      <Button variant="outline" onClick={open}>
        Add Guest
      </Button>
    </>
  );
};

export default AddGuest;

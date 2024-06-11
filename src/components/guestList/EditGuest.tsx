"use client";

import React from "react";
import { Button, Group as MGroup, Radio, Tabs } from "@mantine/core";
import { useForm } from "@mantine/form";
import RsvpStatus from "./RsvpStatus";
import { Group } from "@spiel-wedding/types/Guest";
import {
  showSuccessNotification,
  showFailureNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { GROUP_SWR_KEY, updateGroup } from "@spiel-wedding/hooks/guests";
import { useSWRConfig } from "swr";
import {
  GuestAffiliationSelection,
  GuestInput,
  MailingAddressForm,
} from "@spiel-wedding/components/form";

interface Props {
  group: Group;
  close: () => void;
}

const EditGuest = ({ group, close }: Props): JSX.Element => {
  const [isInvited, setIsInvited] = React.useState(
    group.invited ? "definitely" : "maybe"
  );
  const { mutate } = useSWRConfig();

  const form = useForm<Group>({
    initialValues: group,
    validate: {
      guests: {
        firstName: (value: string) => value.length < 2,
        lastName: (value: string) => value.length < 2,
      },
    },
  });

  const handleInvitedChange = (value: string): void => {
    setIsInvited(value);
    form.setFieldValue("invited", value === "definitely");
  };

  const handleSubmit = async () => {
    const updatedGroup = await updateGroup(form.getTransformedValues(), group);

    if (updatedGroup) {
      showSuccessNotification("Successfully updated guest");
      await mutate(GROUP_SWR_KEY);
    } else {
      showFailureNotification();
    }
  };

  const submitAndClose = async () => {
    await handleSubmit();
    close();
  };

  return (
    <form>
      <Tabs defaultValue="guestInfo">
        <Tabs.List>
          <Tabs.Tab value="guestInfo">Guest Info</Tabs.Tab>
          <Tabs.Tab value="contactInfo">Contact Info & Invitations</Tabs.Tab>
          <Tabs.Tab value="rsvpStatus">RSVP Status</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="guestInfo" pt="xs">
          {form.values.guests.map((guest, index) => {
            return (
              <GuestInput
                form={form}
                groupType="family"
                index={index}
                key={`${guest.guest_id}-edit-guest`}
              />
            );
          })}
          <GuestAffiliationSelection form={form} />

          <Radio.Group
            name="invited"
            label="Invited?"
            mt="lg"
            value={isInvited}
            onChange={handleInvitedChange}
          >
            <MGroup>
              <Radio value="definitely" label="Definitely" />
              <Radio value="maybe" label="Maybe" />
            </MGroup>
          </Radio.Group>
        </Tabs.Panel>

        <Tabs.Panel value="contactInfo" pt="xs">
          <MailingAddressForm form={form} />
          <Radio.Group
            {...form.getInputProps("saveTheDateSent")}
            value={form.values.saveTheDateSent ? "yes" : "no"}
            onChange={(value): void =>
              form.setFieldValue("saveTheDateSent", value === "yes")
            }
            name="saveTheDateSent"
            label="Sent save the date?"
            pt="lg"
          >
            <MGroup>
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </MGroup>
          </Radio.Group>
          <Radio.Group
            {...form.getInputProps("inviteSent")}
            value={form.values.inviteSent ? "yes" : "no"}
            onChange={(value): void => form.setFieldValue("inviteSent", value === "yes")}
            name="inviteSent"
            label="Sent wedding invitation?"
            pt="lg"
          >
            <MGroup>
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </MGroup>
          </Radio.Group>
        </Tabs.Panel>

        <Tabs.Panel value="rsvpStatus" pt="xs">
          {form.values.guests.map((guest, index) => (
            <RsvpStatus
              guest={guest}
              index={index}
              form={form}
              key={`${guest.guest_id}-rsvp-status`}
            />
          ))}
        </Tabs.Panel>
      </Tabs>

      <MGroup justify="right" mt="lg">
        <Button
          variant="outline"
          mr="md"
          onClick={handleSubmit}
          size="md"
          disabled={!form.isDirty()}
        >
          Save
        </Button>

        <Button onClick={submitAndClose} size="md" disabled={!form.isDirty()}>
          Save & Close
        </Button>
      </MGroup>
    </form>
  );
};

export default EditGuest;

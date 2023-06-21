"use client";

import React from "react";
import { Button, Group as MGroup, Radio, Tabs } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ref, set } from "firebase/database";
import RsvpStatus from "./RsvpStatus";
import { database } from "../../../database/database";
import { Group } from "../../../types/Guest";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../../components/notifications/notifications";
import GuestAffiliationSelection from "../components/addGuestForm/GuestAffiliationSelection";
import GuestInput from "../components/addGuestForm/GuestInput";
import MailingAddressForm from "../../../components/form/MailingAddressForm";

interface Props {
  group: Group;
  close: () => void;
}

const EditGuest = (props: Props): JSX.Element => {
  const { group } = props;
  const [isInvited, setIsInvited] = React.useState(
    group.invited ? "definitely" : "maybe"
  );

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

  const handleSubmit = (): void => {
    set(ref(database, "groups/" + group.id), {
      ...form.values,
      isInvited: isInvited === "definitely",
    })
      .then(() => {
        showSuccessNotification("Successfully updated guest");
      })
      .catch((error) => {
        showFailureNotification();
      });
  };

  const submitAndClose = (): void => {
    handleSubmit();
    props.close();
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
              <GuestInput form={form} groupType="family" index={index} key={index} />
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
            <RsvpStatus guest={guest} index={index} form={form} key={index} />
          ))}
        </Tabs.Panel>
      </Tabs>

      <MGroup position="right" mt="lg">
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

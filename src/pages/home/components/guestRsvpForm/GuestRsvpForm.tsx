import React from "react";
import { Button, Divider, Group as MGroup, Radio, Text } from "@mantine/core";
import { ref, set } from "@firebase/database";
import { database } from "../../../../database/database";
import { Group, RsvpResonse } from "../../../../types/Guest";
import { useForm } from "@mantine/form";
import {
  showFailureNotification,
  showSuccessNotification,
} from "../../../../components/notifications/notifications";
import MailingAddressForm from "../../../guestList/components/AddGuestForm/MailingAddressForm";

interface Props {
  selectedGroup: Group;
}

const RsvpForm = (props: Props): JSX.Element => {
  const { selectedGroup } = props;

  const form = useForm<Group>({
    initialValues: selectedGroup,

    validate: {
      address1: (value) => (value.length === 0 ? "Address cannot be empty" : null),
      city: (value) => (value.length === 0 ? "City cannot be empty" : null),
      state: (value) => (value.length === 0 ? "State cannot be empty" : null),
      postal: (value) => (value.length === 0 ? "Zip Code cannot be empty" : null),
      phone: (value) => (value.length === 0 ? "Phone cannot be empty" : null),
      email: (value) => {
        if (value.length === 0) {
          return "Email cannot be empty";
        } else if (!/^\S+@\S+$/.test(value)) {
          return "Invalid email";
        }
      },
    },
  });

  React.useEffect(() => {
    const group = [selectedGroup].map((group) => group)[0];
    group.guests = group.guests.map((guest) => {
      return {
        ...guest,
        rsvp:
          guest.rsvp === RsvpResonse.NO_RESPONSE
            ? RsvpResonse.ACCEPTED
            : RsvpResonse.DECLINED,
      };
    });

    form.setValues(group);
    form.validate();
    form.resetDirty();
  }, [selectedGroup]);

  const handleSubmit = (): void => {
    const groupRef = ref(database, `groups/${selectedGroup.id}`);

    set(groupRef, { ...form.values })
      .then(() => {
        showSuccessNotification("Your response has been saved successfully!");
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  return (
    <>
      {selectedGroup.guests.map((guest, guestIndex) => (
        <>
          <Divider my="sm" />
          <MGroup position="apart">
            <Text>
              {guest.firstName} {guest.lastName}
            </Text>
            <Radio.Group
              name={`rsvp-${guestIndex}`}
              {...form.getInputProps(`guests.${guestIndex}.rsvp`)}
            >
              <MGroup mt="xs">
                <Radio value={RsvpResonse.ACCEPTED} label="Will Attend" />
                <Radio value={RsvpResonse.DECLINED} label="Will Not Attend" />
              </MGroup>
            </Radio.Group>
          </MGroup>

          <MailingAddressForm form={form} />
          {guestIndex === selectedGroup.guests.length - 1 && (
            <Divider my="sm" key="divider-bottom" />
          )}
        </>
      ))}
      <MGroup position="right" mb="lg">
        <Button onClick={handleSubmit} disabled={!form.isValid()}>
          Save
        </Button>
      </MGroup>
    </>
  );
};

export default RsvpForm;

"use client";

import {
  Alert,
  Button,
  Divider,
  Flex,
  Group as MGroup,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { ref } from "@firebase/database";
import { analytics, database } from "@spiel-wedding/database/database";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import MailingAddressForm from "@spiel-wedding/components/form/MailingAddressForm";
import UnknownGuestInput from "./components/UnknownGuestInput";
import RsvpSelection from "./components/RsvpSelectionInput";
import { logEvent } from "firebase/analytics";
import { set } from "firebase/database";
import { showFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { useEffect, useState } from "react";

interface Props {
  selectedGroup: Group;
}

const RsvpForm = (props: Props): JSX.Element => {
  const { selectedGroup } = props;
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<Group>({
    initialValues: selectedGroup,
    validate: {
      address1: isNotEmpty("Address cannot be empty"),
      city: isNotEmpty("City cannot be empty"),
      state: isNotEmpty("State cannot be empty"),
      postal: isNotEmpty("Zip Code cannot be empty"),
      country: isNotEmpty("Country cannot be empty"),
      phone: isNotEmpty("Phone cannot be empty"),
      email: isEmail("Email is not valid"),
      guests: {
        firstName: (value, values, path) =>
          isNameInvalid(value, values, path)
            ? "Please enter a first name"
            : null,
        lastName: (value, values, path) =>
          isNameInvalid(value, values, path)
            ? "Please enter a last name"
            : null,
      },
    },
  });

  useEffect(() => {
    form.values.guests.forEach((guest, guestIndex) => {
      if (guest.rsvp === RsvpResponse.NO_RESPONSE) {
        form.setFieldValue(`guests.${guestIndex}.rsvp`, RsvpResponse.ACCEPTED);
      }
    });
  }, []);

  const isNameInvalid = (
    value: string,
    group: Group,
    path: string,
  ): boolean => {
    const index = Number(path.split(".")[1]);

    if (group.guests[index].rsvp === RsvpResponse.ACCEPTED) {
      return value.length === 0;
    }

    return false;
  };

  const handleSubmit = (): void => {
    const groupRef = ref(database, `groups/${selectedGroup.id}`);
    const rsvpModifications = [...(form.values.rsvpModifications ?? [])];
    rsvpModifications.push({ modifiedAt: new Date().toISOString() });

    const updatedGuests = form.values.guests.map((guest) => {
      if (guest.nameUnknown && guest.rsvp === RsvpResponse.ACCEPTED) {
        return { ...guest, nameUnknown: false };
      }

      return guest;
    });

    const updatedGroup = {
      ...form.values,
      guests: updatedGuests,
      rsvpModifications,
    };

    set(groupRef, updatedGroup)
      .then(() => {
        if (analytics) {
          logEvent(analytics, "rsvp_form_complete", {
            original: selectedGroup,
            updated: form.values,
          });
        }
        nextStep();
      })
      .catch(() => {
        showFailureNotification();
      });
  };

  const nextStep = (): void =>
    setCurrentStep((current) => {
      if (
        (current === 0 && !form.isValid("guests")) ||
        (current !== 0 && form.validate().hasErrors)
      ) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const prevStep = (): void => {
    setCurrentStep((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <>
      <Stepper active={currentStep}>
        <Stepper.Step label="RSVP">
          {form.values.guests.map((guest, guestIndex) => (
            <Flex direction="column" key={guestIndex}>
              <Divider my="sm" />
              <MGroup justify="space-between">
                <Text>
                  {guest.nameUnknown && "Guest name unknown"}
                  {!guest.nameUnknown && `${guest.firstName} ${guest.lastName}`}
                </Text>
                <RsvpSelection form={form} guestIndex={guestIndex} />
              </MGroup>
              {guest.nameUnknown &&
                form.values.guests[guestIndex].rsvp ===
                  RsvpResponse.ACCEPTED && (
                  <UnknownGuestInput form={form} index={guestIndex} />
                )}
              {guestIndex === Object.keys(form.values.guests).length - 1 && (
                <Divider my="sm" />
              )}
            </Flex>
          ))}
        </Stepper.Step>

        <Stepper.Step label="Contact Information">
          <MailingAddressForm form={form} openTabsByDefault />
        </Stepper.Step>

        <Stepper.Step label="Additional Information">
          <TextInput
            label="Dietary Restrictions"
            placeholder="Please enter any dietary restrictions"
            {...form.getInputProps("dietaryRestrictions")}
          />
        </Stepper.Step>

        <Stepper.Completed>
          <Alert title="Success!" color="teal" variant="filled">
            Your reservation has been completed successfully, feel free to come
            back here and edit it anytime before the wedding!
          </Alert>
        </Stepper.Completed>
      </Stepper>

      <MGroup justify="right" mt="xl">
        {currentStep > 0 && currentStep < 3 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {currentStep < 2 && <Button onClick={nextStep}>Next step</Button>}
        {currentStep === 2 && (
          <Button onClick={handleSubmit} disabled={!form.isValid()}>
            Save
          </Button>
        )}
      </MGroup>
    </>
  );
};

export default RsvpForm;

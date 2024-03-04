"use client";

import {
  Alert,
  Button,
  Divider,
  Flex,
  Group as MGroup,
  Stepper,
  Text,
} from "@mantine/core";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import MailingAddressForm from "@spiel-wedding/components/form/MailingAddressForm";
import UnknownGuestInput from "./components/UnknownGuestInput";
import RsvpSelection from "./components/RsvpSelectionInput";
import { showFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { useState } from "react";
import { addEntryToRsvpModifications, updateGroup } from "@spiel-wedding/hooks/guests";

interface Props {
  selectedGroup: Group;
}

const RsvpForm = ({ selectedGroup }: Props): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(0);

  const getInitialValues = () => {
    const formattedGuests = selectedGroup.guests.map((guest) => {
      if (guest.rsvp === RsvpResponse.NO_RESPONSE) {
        return { ...guest, rsvp: RsvpResponse.ACCEPTED };
      }
      return guest;
    });

    return { ...selectedGroup, guests: formattedGuests };
  };

  const form = useForm<Group>({
    initialValues: getInitialValues(),
    validate: {
      address1: isNotEmpty("Address cannot be empty"),
      city: isNotEmpty("City cannot be empty"),
      state: isNotEmpty("State cannot be empty"),
      postal: isNotEmpty("Zip Code cannot be empty"),
      country: isNotEmpty("Country cannot be empty"),
      email: isEmail("Email is not valid"),
      guests: {
        firstName: (value, values, path) =>
          isNameInvalid(value, values, path) ? "Please enter a first name" : null,
        lastName: (value, values, path) =>
          isNameInvalid(value, values, path) ? "Please enter a last name" : null,
      },
    },
  });

  const isNameInvalid = (value: string, group: Group, path: string): boolean => {
    const index = Number(path.split(".")[1]);

    if (group.guests[index].rsvp === RsvpResponse.ACCEPTED) {
      return value.length === 0;
    }

    return false;
  };

  const handleSubmit = async () => {
    await addEntryToRsvpModifications(selectedGroup.id);
    const updatedGroup = await updateGroup(form.getTransformedValues(), selectedGroup);

    if (updatedGroup === undefined) {
      showFailureNotification();
    } else {
      nextStep();
    }
  };

  const nextStep = (): void =>
    setCurrentStep((current) => {
      if (
        (current === 0 && !form.isValid("guests")) ||
        (current !== 0 && form.validate().hasErrors)
      ) {
        return current;
      }
      return current < 2 ? current + 1 : current;
    });

  const prevStep = (): void => {
    setCurrentStep((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <>
      <Stepper active={currentStep}>
        <Stepper.Step label="RSVP">
          {form.values.guests.map((guest, guestIndex) => (
            <Flex direction="column" key={`${guest.id}-rsvp-form`}>
              <Divider my="sm" />
              <MGroup justify="space-between">
                <Text>
                  {guest.nameUnknown && "Guest name unknown"}
                  {!guest.nameUnknown && `${guest.firstName} ${guest.lastName}`}
                </Text>
                <RsvpSelection form={form} guestIndex={guestIndex} />
              </MGroup>
              {guest.nameUnknown &&
                form.values.guests[guestIndex].rsvp === RsvpResponse.ACCEPTED && (
                  <UnknownGuestInput form={form} index={guestIndex} />
                )}
              {guestIndex === form.values.guests.length - 1 && <Divider my="sm" />}
            </Flex>
          ))}
        </Stepper.Step>

        <Stepper.Step label="Contact Information">
          <MailingAddressForm form={form} openTabsByDefault showEmailTooltip />
        </Stepper.Step>

        <Stepper.Completed>
          <Alert title="Success!" color="teal" variant="filled">
            Your reservation has been completed successfully, feel free to come back here
            and edit it anytime before September 26th!
          </Alert>
        </Stepper.Completed>
      </Stepper>

      <MGroup justify="right" mt="xl">
        {currentStep > 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}

        {currentStep === 0 && (
          <Button onClick={nextStep} className="primaryButton">
            Next step
          </Button>
        )}
        {currentStep === 1 && (
          <Button
            onClick={handleSubmit}
            disabled={!form.isValid()}
            className="primaryButton"
          >
            Save
          </Button>
        )}
      </MGroup>
    </>
  );
};

export default RsvpForm;
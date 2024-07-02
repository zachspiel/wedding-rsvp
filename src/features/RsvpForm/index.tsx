"use client";

import { Alert, Button, Flex, Group as MGroup, Stepper, Title } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import EventCard from "@spiel-wedding/components/eventCard";
import MailingAddressForm from "@spiel-wedding/components/form/MailingAddressForm";
import { updateGroup } from "@spiel-wedding/hooks/guests";
import { Event, Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import GuestBookForm from "../GuestBookForm";
import { sendMail } from "./action";
import RsvpModal from "./components/RsvpModal";
import classes from "./rsvpFormStyles.module.css";

interface Props {
  events: Event[];
  selectedGroup: Group;
}

const TOTAL_STEPS = 3;

const RsvpForm = ({ events, selectedGroup }: Props): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [error, setError] = useState<string | null>();

  const getInitialValues = () => {
    const formattedGuests = selectedGroup.guests.map((guest) => {
      const updatedResponses = guest.event_responses.map((response) => {
        if (response.rsvp === RsvpResponse.NO_RESPONSE) {
          return { ...response, rsvp: RsvpResponse.ACCEPTED };
        }

        return response;
      });

      return { ...guest, event_responses: updatedResponses };
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
    const { event_responses } = group.guests[index];

    if (event_responses.some((response) => response.rsvp === RsvpResponse.ACCEPTED)) {
      return value.length === 0;
    }

    return false;
  };

  const handleSubmit = async () => {
    const updatedGroup = await updateGroup(form.getTransformedValues(), selectedGroup);

    if (updatedGroup === undefined) {
      setError("An error occurred while saving your RSVP. Please try again later");
    } else {
      nextStep();
      await sendMail({ group: form.values, events });
      await revalidatePage("/");
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
      return current < TOTAL_STEPS ? current + 1 : current;
    });

  const prevStep = (): void => {
    setCurrentStep((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <RsvpModal selectedGroup={selectedGroup}>
      <Stepper active={currentStep} orientation={isMobile ? "vertical" : "horizontal"}>
        <Stepper.Step label="RSVP">
          <Flex direction="column">
            <Title order={2} ta="center" className={classes.title}>
              Events
            </Title>

            {events.map((event) => {
              const guestsInvitedToEvent = form.values.guests.filter(
                (guest) =>
                  guest.event_responses.some(
                    (response) => response.eventId === event.event_id
                  ) || guest.nameUnknown
              );

              if (guestsInvitedToEvent.length === 0) {
                return <></>;
              }

              return (
                <EventCard
                  guests={guestsInvitedToEvent}
                  event={event}
                  form={form}
                  key={`${event.event_id}`}
                />
              );
            })}
          </Flex>
        </Stepper.Step>

        <Stepper.Step label="Contact Information">
          <MailingAddressForm
            form={form}
            openTabsByDefault
            showEmailTooltip
            emailRequired
          />
        </Stepper.Step>

        <Stepper.Step label="Leave a note">
          <Title order={4} fw="normal" ta="center">
            Leave a note for Sedona and Zach. (Optional)
          </Title>

          <GuestBookForm
            name={`${form.values.guests[0].firstName} ${form.values.guests[0].lastName}`}
            email={form.values.email}
            handleSubmit={handleSubmit}
            handleSubmitWithoutMessage
            customButtonLabel="Save RSVP"
          />
        </Stepper.Step>

        <Stepper.Completed>
          {!error && (
            <Alert title="Success!" color="teal" variant="filled">
              Your reservation has been completed successfully, feel free to come back
              here and edit it anytime before September 26th!
            </Alert>
          )}
          {error && (
            <Alert title="Error" color="red" variant="filled">
              {error}
            </Alert>
          )}
        </Stepper.Completed>
      </Stepper>

      <MGroup
        justify={currentStep === 0 ? "right" : "space-between"}
        mt="xl"
        style={{ borderTop: "1px solid --var(--mantine-color-gray-3)" }}
      >
        {currentStep > 0 && currentStep < TOTAL_STEPS && (
          <Button variant="default" onClick={prevStep} leftSection={<IconChevronLeft />}>
            Back
          </Button>
        )}

        {currentStep < TOTAL_STEPS - 1 && (
          <Button onClick={nextStep} rightSection={<IconChevronRight />}>
            Next step
          </Button>
        )}
      </MGroup>
    </RsvpModal>
  );
};

export default RsvpForm;

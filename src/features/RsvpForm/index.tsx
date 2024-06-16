"use client";

import {
  Alert,
  Button,
  Divider,
  Flex,
  Group as MGroup,
  Stepper,
  Text,
  Title,
  TextInput,
  Skeleton,
  Card,
  Center,
  SimpleGrid,
} from "@mantine/core";
import { Group, RsvpResponse } from "@spiel-wedding/types/Guest";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import MailingAddressForm from "@spiel-wedding/components/form/MailingAddressForm";
import RsvpSelection from "./components/RsvpSelectionInput";
import { showCustomFailureNotification } from "@spiel-wedding/components/notifications/notifications";
import { useState } from "react";
import { updateGroup } from "@spiel-wedding/hooks/guests";
import { sendMail } from "./action";
import GuestBookForm from "../GuestBookForm";
import {
  IconBuildingArch,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import useSWR from "swr";
import { getEvents } from "@spiel-wedding/hooks/events";
import classes from "./rsvpFormStyles.module.css";

interface Props {
  selectedGroup: Group;
}

const TOTAL_STEPS = 3;

const RsvpForm = ({ selectedGroup }: Props): JSX.Element => {
  const { data: events, isLoading } = useSWR("events", getEvents);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const getInitialValues = () => {
    const formattedGuests = selectedGroup.guests.map((guest) => {
      const updatedResponses = guest.event_responses.map((response) => {
        if (response.rsvp === RsvpResponse.NO_RESPONSE) {
          return { ...response, rsvp: RsvpResponse.ACCEPTED };
        }

        return { ...response };
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

    if (group.guests[index].rsvp === RsvpResponse.ACCEPTED) {
      return value.length === 0;
    }

    return false;
  };

  const handleSubmit = async () => {
    const updatedGroup = await updateGroup(form.getTransformedValues(), selectedGroup);

    if (updatedGroup === undefined) {
      showCustomFailureNotification("An error occurred. Please try again later");
    } else {
      nextStep();
      await sendMail(form.values);
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
    <>
      <Stepper active={currentStep} orientation={isMobile ? "vertical" : "horizontal"}>
        <Stepper.Step label="RSVP">
          {isLoading && (
            <>
              <Skeleton w="100%" h={20} mt="mb" />
              <Skeleton w="100%" h={20} mt="mb" />
            </>
          )}

          {!isLoading && (
            <Flex direction="column">
              <Title order={2} ta="center" className={classes.title}>
                Events
              </Title>
              {form.values.guests
                .filter((guest) => guest.nameUnknown)
                .map((guest, guestIndex) => (
                  <Flex direction="column" key={`${guest.guest_id}-rsvp-form`}>
                    <Divider my="sm" />

                    {guest.nameUnknown &&
                      form.values.guests[guestIndex].rsvp === RsvpResponse.ACCEPTED && (
                        <Flex>
                          <TextInput
                            label="First Name"
                            placeholder="First Name"
                            required
                            mr="lg"
                            {...form.getInputProps(`guests.${guestIndex}.firstName`)}
                          />
                          <TextInput
                            label="Last Name"
                            placeholder="Last Name"
                            required
                            {...form.getInputProps(`guests.${guestIndex}.lastName`)}
                          />
                        </Flex>
                      )}
                    {guestIndex === form.values.guests.length - 1 && <Divider my="sm" />}
                  </Flex>
                ))}

              {(events ?? [])
                .sort((a, b) => a.order - b.order)
                .map((event) => {
                  const guestsInvitedToEvent = form.values.guests.filter((guest) =>
                    guest.event_responses.some(
                      (response) => response.eventId === event.event_id
                    )
                  );

                  if (guestsInvitedToEvent.length === 0) {
                    return <></>;
                  }

                  return (
                    <Card key={`event-${event.event_id}-rsvp`} withBorder mb="lg">
                      <Card.Section bg="#8e9386" c="white" p="sm">
                        <Title order={4} fw="normal" ta="center">
                          {event.emoji}
                          {event.title}
                        </Title>
                      </Card.Section>
                      <Card.Section p="md" withBorder>
                        <SimpleGrid cols={2}>
                          <div>
                            <MGroup gap={8} mb={8}>
                              <Center>
                                <IconBuildingArch className={classes.icon} stroke={1.5} />
                                <Text size="sm" ml="xs">
                                  {event.location}
                                </Text>
                              </Center>
                            </MGroup>

                            <MGroup gap={8} mb={8}>
                              <Center>
                                <IconMapPin className={classes.icon} stroke={1.5} />
                                <Text size="sm" ml="xs">
                                  {event.address1} {event.address2} {event.city}
                                  {", "}
                                  {event.state} {event.postal}
                                </Text>
                              </Center>
                            </MGroup>
                          </div>
                          <div>
                            <MGroup gap={8} mb={8}>
                              <Center>
                                <IconCalendar className={classes.icon} stroke={1.5} />
                                <Text size="sm" ml="xs">
                                  {new Date(event.date).toDateString()}
                                </Text>
                              </Center>
                            </MGroup>

                            <MGroup gap={8} mb={8}>
                              <Center>
                                <IconClock
                                  size="1.05rem"
                                  className={classes.icon}
                                  stroke={1.5}
                                />
                                <Text size="sm" ml="xs">
                                  {event.time}
                                </Text>
                              </Center>
                            </MGroup>
                          </div>
                        </SimpleGrid>
                      </Card.Section>

                      <Card.Section p="md">
                        {guestsInvitedToEvent.map((guest, guestIndex) => {
                          const eventResponse = guest.event_responses.filter(
                            (response) => response.eventId === event.event_id
                          )[0];
                          const eventIndex = guest.event_responses.findIndex(
                            (response) =>
                              response.response_id === eventResponse.response_id
                          );

                          return (
                            <MGroup
                              justify="space-between"
                              key={`guest-${guest.guest_id}-${event.event_id}`}
                              my="md"
                            >
                              <Text>
                                {guest.nameUnknown && "Guest name unknown"}
                                {!guest.nameUnknown &&
                                  `${guest.firstName} ${guest.lastName}`}
                              </Text>
                              <RsvpSelection
                                form={form}
                                guestIndex={guestIndex}
                                responseIndex={eventIndex}
                              />
                            </MGroup>
                          );
                        })}
                      </Card.Section>
                    </Card>
                  );
                })}
            </Flex>
          )}
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
          <Alert title="Success!" color="teal" variant="filled">
            Your reservation has been completed successfully, feel free to come back here
            and edit it anytime before September 26th!
          </Alert>
        </Stepper.Completed>
      </Stepper>

      <MGroup
        justify={currentStep === 0 ? "right" : "space-between"}
        mt="xl"
        style={{ borderTop: "1px solid --var(--mantine-color-gray-3)" }}
      >
        {currentStep > 0 && (
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
    </>
  );
};

export default RsvpForm;

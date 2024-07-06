import { Alert, Text } from "@mantine/core";
import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import RsvpSearchbar from "@spiel-wedding/features/RsvpSearchbar/RsvpSearchbar";
import { Event } from "@spiel-wedding/types/Guest";
import { IconInfoCircle } from "@tabler/icons-react";

interface Props {
  events: Event[];
}

const RSVP = ({ events }: Props): JSX.Element => {
  return (
    <SectionContainer>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        Please enter the first and last name of one member of your party below. If
        you&#39;re responding for you and a guest (or your family), you&#39;ll be able to
        RSVP for your entire group on the next page.
      </Text>

      <Text>
        We love your children, but due to space restrictions, we cannot accommodate guests
        under the age of 18 on our wedding day. The only children present will be those in
        the wedding party. Thank you for your understanding.
      </Text>

      <Text>
        Please reach out to Sedona or Zach if you have any questions about guest
        attendance.
      </Text>
      <Alert variant="light" color="teal" icon={<IconInfoCircle />}>
        Please RSVP no later than September 26th 2024.
      </Alert>

      <RsvpSearchbar events={events} />
    </SectionContainer>
  );
};

export default RSVP;

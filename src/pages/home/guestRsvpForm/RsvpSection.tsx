import React from "react";
import SectionTitle from "../../../components/common/SectionTitle";
import SearchForGuest from "./SearchForGuestForm";
import { Text } from "@mantine/core";

const RsvpSection = (): JSX.Element => {
  return (
    <>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        {`Please enter the first and last name of one member of your party below. If
                you're responding for you and a guest (or your family), you'll be able to
                RSVP for your entire group on the next page.`}
      </Text>
      <SearchForGuest />
    </>
  );
};

export default RsvpSection;

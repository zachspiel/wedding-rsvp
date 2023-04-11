import React from "react";
import {
  Button,
  Divider,
  Flex,
  Group as MGroup,
  Radio,
  Text,
  TextInput,
} from "@mantine/core";
import { ref, set, onValue } from "@firebase/database";
import { database } from "../database/database";
import SectionTitle from "../common/SectionTitle";
import { Group, RsvpResonse } from "../../types/Guest";
import { useForm } from "@mantine/form";
import {
  showFailureNotification,
  showSuccessNotification,
} from "../guests/util";
import { guestMatchesSearch } from "./rsvpUtil";

const RsvpForm = (): JSX.Element => {
  const [searchValue, setSearchValue] = React.useState("");
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [searchResults, setSearchResults] = React.useState<Group[]>([]);
  const [error, setError] = React.useState<string>();
  const [selectedGroup, setSelectedGroup] = React.useState<Group>();

  const form = useForm<Group>({
    initialValues: groups[0],
  });

  const getSearchResults = (): void => {
    const filteredResults = groups.filter(
      (group) =>
        group.guests.filter((guest) => guestMatchesSearch(searchValue, guest))
          .length > 0
    );

    if (filteredResults.length === 0) {
      setError(
        "Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation."
      );
    } else {
      setError(undefined);
    }

    setSearchResults(filteredResults);
  };

  React.useEffect(() => {
    const guestsRef = ref(database, "guests/");
    onValue(guestsRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      const groupData = Object.keys(data).map((key) => {
        return { ...data[key], id: key };
      });

      setGroups(groupData);
    });
  }, []);

  React.useEffect(() => {
    if (selectedGroup !== undefined) {
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
      form.resetDirty();
    }
  }, [selectedGroup]);

  const handleSubmit = (): void => {
    if (selectedGroup !== undefined) {
      set(ref(database, "guests/" + selectedGroup.id), { ...form.values })
        .then(() => {
          showSuccessNotification("Your response has been saved successfully!");
        })
        .catch(() => {
          showFailureNotification();
        });
    }
  };

  return (
    <>
      <SectionTitle title="RSVP" id="rsvp" />
      <Text>
        Please enter the first and last name of one member of your party below.
        If you're responding for you and a guest (or your family), you'll be
        able to RSVP for your entire group on the next page.
      </Text>
      <MGroup pb="lg">
        <TextInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          error={error}
          required
          placeholder="First and Last name"
          description="Ex. Zachary Spielberger (not The Spielberger Family or Dr. & Mr. Spielberger)"
        />
        <Button mt={error ? 0 : "lg"} onClick={getSearchResults}>
          Continue
        </Button>
      </MGroup>
      {selectedGroup === undefined &&
        searchResults.map((group, index) => (
          <>
            <Divider my="sm" key={`divider-${index}`} />
            <MGroup position="apart" key={`group-${index}`}>
              <Flex direction="column">
                {group.guests.map((guest, guestIndex) => (
                  <Text key={`group-${index}-guest-${guestIndex}`}>
                    {guest.firstName} {guest.lastName}
                  </Text>
                ))}
              </Flex>
              <Button onClick={() => setSelectedGroup(group)}>Select</Button>
            </MGroup>
            {index === Object.keys(searchResults).length - 1 && (
              <Divider my="sm" key={`divider-bottom-${index}`} />
            )}
          </>
        ))}
      {selectedGroup !== undefined && (
        <Text>Select your info below or try searching again.</Text>
      )}
      {selectedGroup !== undefined &&
        selectedGroup.guests.map((guest, guestIndex) => (
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
            {guestIndex === selectedGroup.guests.length - 1 && (
              <Divider my="sm" key="divider-bottom" />
            )}
          </>
        ))}
      {selectedGroup !== undefined && (
        <MGroup position="right" mb="lg">
          <Button onClick={handleSubmit}>Save</Button>
        </MGroup>
      )}
    </>
  );
};

export default RsvpForm;

"use client";

import {
  ActionIcon,
  Group as MGroup,
  Skeleton,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { Event, Group } from "@spiel-wedding/types/Guest";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ReactElement, useState, useTransition } from "react";
import RsvpForm from "../RsvpForm";
import SearchResults from "./components/SearchResults";
import { getSearchResults } from "./action";

interface SearchForm {
  name: string;
}

interface Props {
  events: Event[];
}

const RsvpSearchbar = ({ events }: Props): ReactElement => {
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [searchResults, setSearchResults] = useState<Group[] | null>(null);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [isPending, startTransition] = useTransition();

  const hasResults = searchResults && searchResults.length > 0;

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: isNotEmpty("Please enter your full name"),
    },
  });

  const handleSubmit = async ({ name }: SearchForm) => {
    setSelectedGroup(undefined);
    setSearchResults(null);
    try {
      const results = await getSearchResults(name);
      startTransition(() => {
        setSearchResults(results);
      });
    } catch (error: unknown) {
      console.error(error);
      setSearchResults([]);
    }
  };

  const selectGroup = (group: Group) => {
    setSelectedGroup(group);
    form.reset();
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MGroup justify={isMobile ? "" : "center"}>
          <TextInput
            radius="xl"
            size="md"
            w={isMobile ? "100%" : "75%"}
            placeholder="Enter your first and last name"
            rightSectionWidth={42}
            key={form.key("name")}
            {...form.getInputProps("name")}
            leftSection={
              <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            }
            rightSection={
              <ActionIcon
                size={32}
                radius="xl"
                variant="filled"
                component="button"
                type="submit"
                aria-label="Submit search"
                loading={isPending}
              >
                <IconArrowRight
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              </ActionIcon>
            }
          />
        </MGroup>
      </form>

      {isPending && (
        <>
          <Skeleton w="100%" h={25} />

          <Skeleton w="100%" h={25} my="md" />

          <Skeleton w="100%" h={25} />
        </>
      )}

      {searchResults && !isPending && searchResults.length === 0 && (
        <Text ta="center" c="dimmed">
          Hm... we can't find your name. Make sure you enter your name exactly as it
          appears on your invitation.
        </Text>
      )}

      {!selectedGroup && hasResults && (
        <>
          <Text>Select your party below or try searching again.</Text>
          <Text>
            If none of these are you, please reach out to Sedona and Zach to see exactly
            how they entered your details.
          </Text>
          <SearchResults searchResults={searchResults} setSelectedGroup={selectGroup} />
        </>
      )}

      {selectedGroup && <RsvpForm selectedGroup={selectedGroup} events={events} />}
    </>
  );
};

export default RsvpSearchbar;

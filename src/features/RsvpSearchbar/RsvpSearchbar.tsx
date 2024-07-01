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
import { useState } from "react";
import useSWR from "swr";
import RsvpForm from "../RsvpForm";
import SearchResults from "./components/SearchResults";

interface SearchForm {
  name: string;
}

const getMatchingGuests = async (name: string): Promise<Group[]> => {
  const result = await fetch(`/api/searchResult?name=${name}`).then((res) => res.json());

  if (result.length === 0) {
    throw {
      info: `Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.`,
      status: 400,
    };
  }

  return result;
};

interface Props {
  events: Event[];
}

const RsvpSearchbar = ({ events }: Props): JSX.Element => {
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [searchForm, setSearchForm] = useState<SearchForm>();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { data, error, isLoading, mutate } = useSWR(
    searchForm ? ["searchResults", searchForm] : null,
    ([url, params]) => getMatchingGuests(params.name),
    { fallbackData: [] }
  );

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: isNotEmpty("Please enter your full name"),
    },
  });

  const handleSubmit = (values: SearchForm) => {
    setSelectedGroup(undefined);
    setSearchForm(values);
    mutate();
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
            w={isMobile ? "100%" : "initial"}
            placeholder="Enter your first and last name"
            rightSectionWidth={42}
            {...form.getInputProps("name")}
            error={form.errors.name}
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

      {error && (
        <Text c="red" fz="sm" ta="center">
          {error.info}
        </Text>
      )}

      {isLoading && (
        <>
          <Skeleton w="100%" h={25} />

          <Skeleton w="100%" h={25} my="md" />

          <Skeleton w="100%" h={25} />
        </>
      )}

      {!selectedGroup && data.length > 0 && (
        <>
          <Text>Select your party below or try searching again.</Text>
          <Text>
            If none of these are you, please reach out to Sedona and Zach to see exactly
            how they entered your details.
          </Text>
          <SearchResults searchResults={data} setSelectedGroup={selectGroup} />
        </>
      )}

      {selectedGroup && <RsvpForm selectedGroup={selectedGroup} events={events} />}
    </>
  );
};

export default RsvpSearchbar;

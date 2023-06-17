import React from "react";
import { Button, Group as MGroup, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

interface Props {
  getSearchResults: (firstName: string, lastName: string) => void;
}

const Searchbar = (props: Props): JSX.Element => {
  const { getSearchResults } = props;
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: {
      firstName: isNotEmpty("Please enter a first name"),
      lastName: isNotEmpty("Please enter a last name"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(() => {
        getSearchResults(form.values.firstName, form.values.lastName);
        form.reset();
      })}
    >
      <MGroup pb="lg" align="end">
        <TextInput
          label="First name"
          placeholder="First name"
          {...form.getInputProps("firstName")}
        />

        <TextInput
          label="Last name"
          placeholder="Last name"
          {...form.getInputProps("lastName")}
        />

        <Button type="submit" disabled={!form.isValid()}>
          Search
        </Button>
      </MGroup>
    </form>
  );
};

export default Searchbar;

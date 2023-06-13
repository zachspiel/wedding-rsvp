import React from "react";
import { Button, Group as MGroup, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

interface Props {
  hasError: boolean;
  getSearchResults: (firstName: string, lastName: string) => void;
}

const Searchbar = (props: Props): JSX.Element => {
  const { hasError, getSearchResults } = props;
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
      <MGroup pb="lg">
        <TextInput
          placeholder="First name"
          label="First Name"
          {...form.getInputProps("firstName")}
        />

        <TextInput
          placeholder="Last name"
          label="Last Name"
          {...form.getInputProps("lastName")}
        />

        <Button mt={hasError ? 0 : "lg"} type="submit" disabled={!form.isValid()}>
          Search
        </Button>
      </MGroup>
    </form>
  );
};

export default Searchbar;

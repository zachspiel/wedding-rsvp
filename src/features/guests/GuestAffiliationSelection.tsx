import React from "react";
import { Select } from "@mantine/core";
import { Group, GuestAffiliation } from "../../types/Guest";
import { UseFormReturnType } from "@mantine/form";

interface Props {
  form: UseFormReturnType<Group>;
}

const GuestAffiliationSelection = (props: Props): JSX.Element => {
  const { form } = props;
  const dropdownItems = Object.values(GuestAffiliation).map((affiliation) => {
    return { value: affiliation, label: affiliation };
  });

  return (
    <Select
      label="Relationship to You"
      placeholder="Select..."
      mt="lg"
      allowDeselect
      name="affiliation"
      {...form.getInputProps("affiliation")}
      data={dropdownItems}
    />
  );
};

export default GuestAffiliationSelection;

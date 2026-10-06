import { Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Group, GuestAffiliation } from "@spiel-wedding/types/Guest";
import { ReactElement } from "react";

interface Props {
  form: UseFormReturnType<Group>;
}

const GuestAffiliationSelection = ({ form }: Props): ReactElement => {
  const dropdownItems = Object.values(GuestAffiliation).map((affiliation) => {
    return { value: affiliation, label: affiliation };
  });

  return (
    <Select
      label="Relationship to You"
      placeholder="Select..."
      mt="lg"
      allowDeselect
      data={dropdownItems}
      {...form.getInputProps("affiliation")}
    />
  );
};

export default GuestAffiliationSelection;

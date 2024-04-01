import { Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Group, GuestAffiliation } from "@spiel-wedding/types/Guest";

interface Props {
  form: UseFormReturnType<Group>;
}

const GuestAffiliationSelection = ({ form }: Props): JSX.Element => {
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

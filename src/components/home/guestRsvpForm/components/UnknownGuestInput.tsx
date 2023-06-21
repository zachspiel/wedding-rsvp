import { Flex, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Group } from "../../../../types/Guest";

interface Props {
  form: UseFormReturnType<Group>;
  index: number;
}

const UnknownGuestInput = (props: Props): JSX.Element => {
  const { form, index } = props;
  return (
    <Flex>
      <TextInput
        label="First Name"
        placeholder="First Name"
        required
        mr="lg"
        {...form.getInputProps(`guests.${index}.firstName`)}
      />
      <TextInput
        label="Last Name"
        placeholder="Last Name"
        required
        {...form.getInputProps(`guests.${index}.lastName`)}
      />
    </Flex>
  );
};

export default UnknownGuestInput;

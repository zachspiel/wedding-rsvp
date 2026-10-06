import { Text } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import { ReactElement } from "react";

interface Props {
  group: Group;
}

const AddressColumn = (props: Props): ReactElement => {
  const { group } = props;

  if (group.address1?.length === 0) {
    return <Text c="red">Missing Address</Text>;
  }

  return (
    <>
      <Text>{group.address1}</Text>
      <Text>{group.address2}</Text>
      <Text>
        {group.city}, {group.state} {group.postal}
      </Text>
    </>
  );
};

export default AddressColumn;

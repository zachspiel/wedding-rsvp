import { useMemo } from "react";
import {
  ActionIcon,
  Button,
  Grid,
  Group as MGroup,
  Select,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { Group, RelationshipType } from "@spiel-wedding/types/Guest";
import { UseFormReturnType } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { addChildToGuests, addPartnerToGuests } from "./util";
import findLastIndex from "lodash.findlastindex";

interface Props {
  form: UseFormReturnType<Group>;
  index: number;
  groupType: string;
}

const GuestInput = (props: Props): JSX.Element => {
  const { form, groupType, index } = props;
  const { CHILD, PARTNER, PRIMARY } = RelationshipType;
  const { guests } = form.values;
  const guest = guests[index];
  const firstChildInGroupIndex = guests.findIndex(
    (guest) => guest.relationshipType === CHILD,
  );

  const lastAdultIndex = useMemo(
    () => findLastIndex(guests, (guest) => guest.relationshipType !== CHILD),
    [guests],
  );

  const showAddPlusOneButton = useMemo(
    () =>
      guests.filter((guest) => guest.relationshipType === PARTNER).length === 0,
    [guests],
  );

  const showAddAdultButton = useMemo(() => {
    return (
      groupType === "family" &&
      guest.relationshipType === PARTNER &&
      index === lastAdultIndex
    );
  }, [guests, index, lastAdultIndex]);

  const showAddChildButton = useMemo(() => {
    return index === guests.length - 1 && groupType === "family";
  }, [guests, index]);

  return (
    <>
      {firstChildInGroupIndex === index && (
        <Title
          order={4}
          size="h3"
          style={{ fontWeight: 900, textAlign: "left" }}
          id="rsvp"
          mt="lg"
        >
          Children
        </Title>
      )}

      <Grid>
        <Grid.Col span={2}>
          {guest.relationshipType !== CHILD && (
            <Select
              label={index === 0 ? "Title" : ""}
              placeholder="Select..."
              name="title"
              allowDeselect
              disabled={guest.nameUnknown ?? false}
              data={[
                { value: "Mr.", label: "Mr." },
                { value: "Mrs.", label: "Mrs." },
                { value: "Ms.", label: "Ms." },
                { value: "Miss", label: "Miss" },
                { value: "Mx.", label: "Mx." },
                { value: "Dr.", label: "Dr." },
              ]}
              {...form.getInputProps(`guests.${index}.title`)}
            />
          )}
          {guest.relationshipType === CHILD && (
            <TextInput value="Child" disabled />
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={index === 0 ? "First Name" : ""}
            placeholder={guest.nameUnknown ? "" : "First Name"}
            disabled={guest.nameUnknown}
            name="firstName"
            required
            {...form.getInputProps(`guests.${index}.firstName`)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={index === 0 ? "Last Name" : ""}
            placeholder={guest.nameUnknown ? "" : "Last Name"}
            disabled={guest.nameUnknown}
            name="lastName"
            required
            {...form.getInputProps(`guests.${index}.lastName`)}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          {index !== 0 && (
            <MGroup>
              <ActionIcon
                onClick={(): void => form.removeListItem("guests", index)}
              >
                <IconX size="1.125rem" />
              </ActionIcon>
            </MGroup>
          )}
        </Grid.Col>
      </Grid>
      {guest.relationshipType === PRIMARY && showAddPlusOneButton && (
        <Button
          variant="outline"
          onClick={(): void => addPartnerToGuests(form)}
          mt="lg"
          mr="md"
        >
          Add Plus One
        </Button>
      )}
      {index > 0 && guest.relationshipType !== PRIMARY && (
        <Switch
          mt="lg"
          pb="sm"
          label="Name Unknown"
          {...form.getInputProps(`guests.${index}.nameUnknown`)}
        />
      )}

      {showAddAdultButton && (
        <Button
          variant="outline"
          onClick={(): void => addPartnerToGuests(form)}
          mt="lg"
        >
          Add Adult
        </Button>
      )}

      {showAddChildButton && (
        <Button
          variant="outline"
          onClick={(): void => addChildToGuests(form)}
          mt="lg"
          ml="sm"
        >
          Add Child
        </Button>
      )}
    </>
  );
};

export default GuestInput;

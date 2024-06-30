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
import { Event, Group, RelationshipType } from "@spiel-wedding/types/Guest";
import { UseFormReturnType } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { addChildToGuests, addPartnerToGuests } from "../../features/AddGroupForm/util";
import findLastIndex from "lodash.findlastindex";

interface Props {
  form: UseFormReturnType<Group>;
  index: number;
  groupType: string;
  events: Event[];
}

const { CHILD, PARTNER, PRIMARY } = RelationshipType;

const GuestInput = ({ form, index, groupType, events }: Props): JSX.Element => {
  const { guests } = form.values;
  const guest = guests[index];

  const firstChildInGroupIndex = guests.findIndex(
    (guest) => guest.relationshipType === CHILD
  );

  const lastAdultIndex = findLastIndex(
    guests,
    (guest) => guest.relationshipType !== CHILD
  );

  const showAddPlusOneButton =
    guests.filter((guest) => guest.relationshipType === PARTNER).length === 0;

  const showAddAdultButton =
    groupType === "family" &&
    guest.relationshipType === PARTNER &&
    index === lastAdultIndex;

  const showAddChildButton = index === guests.length - 1 && groupType === "family";

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
          {guest.relationshipType === CHILD && <TextInput value="Child" disabled />}
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
              <ActionIcon onClick={(): void => form.removeListItem("guests", index)}>
                <IconX size="1.125rem" />
              </ActionIcon>
            </MGroup>
          )}
        </Grid.Col>
      </Grid>
      {guest.relationshipType === PRIMARY && showAddPlusOneButton && (
        <Button
          variant="outline"
          onClick={(): void => addPartnerToGuests(form, events)}
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
          onClick={(): void => addPartnerToGuests(form, events)}
          mt="lg"
        >
          Add Adult
        </Button>
      )}

      {showAddChildButton && (
        <Button
          variant="outline"
          onClick={(): void => addChildToGuests(form, events)}
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

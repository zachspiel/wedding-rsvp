import { UseFormReturnType } from "@mantine/form";
import { Accordion, Grid, TextInput, Select, Alert } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import { STATES } from "./states";

interface Props {
  form: UseFormReturnType<Group>;
  openTabsByDefault?: boolean;
  showEmailTooltip?: boolean;
}

const MailingAddressForm = ({
  form,
  openTabsByDefault,
  showEmailTooltip,
}: Props): JSX.Element => {
  const openAllTabs = openTabsByDefault ?? false;
  const defaultValue = openAllTabs ? ["mailing", "contact"] : ["mailing"];

  return (
    <Accordion defaultValue={defaultValue} variant="separated" mt="xl" multiple>
      <Accordion.Item value="mailing">
        <Accordion.Control>Mailing Address</Accordion.Control>
        <Accordion.Panel>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Street Address"
                name="streetAddress"
                {...form.getInputProps("address1")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Apt / Floor"
                name="streetAddress2"
                {...form.getInputProps("address2")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput label="City" name="city" {...form.getInputProps("city")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="State"
                name="State"
                data={STATES}
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Zip Code"
                name="postal"
                {...form.getInputProps("postal")}
              />
            </Grid.Col>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="contact">
        <Accordion.Control>Email</Accordion.Control>
        <Accordion.Panel>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Email" name="email" {...form.getInputProps("email")} />
            </Grid.Col>
          </Grid>

          {showEmailTooltip && (
            <Alert
              variant="light"
              color="teal"
              style={{ width: "fit-content" }}
              mt="sm"
              fz="sm"
            >
              This will only be used to let you know about any important wedding updates.
            </Alert>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default MailingAddressForm;

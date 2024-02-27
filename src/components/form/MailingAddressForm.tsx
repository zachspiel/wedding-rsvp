import { UseFormReturnType } from "@mantine/form";
import { Accordion, Grid, TextInput, Select } from "@mantine/core";
import { countries } from "./countries";
import { Group } from "@spiel-wedding/types/Guest";
import { STATES } from "./states";

interface Props {
  form: UseFormReturnType<Group>;
  openTabsByDefault?: boolean;
}

const MailingAddressForm = (props: Props): JSX.Element => {
  const { form, openTabsByDefault } = props;
  const openAllTabs = openTabsByDefault ?? false;
  const defaultValue = openAllTabs ? ["mailing", "contact"] : ["mailing"];

  return (
    <Accordion defaultValue={defaultValue} variant="separated" mt="xl" multiple>
      <Accordion.Item value="mailing">
        <Accordion.Control>Mailing Address</Accordion.Control>
        <Accordion.Panel>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Street Address"
                name="streetAddress"
                {...form.getInputProps("address1")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Apt / Floor"
                name="streetAddress2"
                {...form.getInputProps("address2")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="City" name="city" {...form.getInputProps("city")} />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="State"
                name="State"
                data={STATES}
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Zip Code"
                name="postal"
                {...form.getInputProps("postal")}
              />
            </Grid.Col>
            <Grid.Col>
              <Select
                label="Country"
                searchable
                allowDeselect
                data={countries.map((country) => {
                  return { value: country, label: country };
                })}
                {...form.getInputProps("country")}
              />
            </Grid.Col>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="contact">
        <Accordion.Control>Email & Mobile</Accordion.Control>
        <Accordion.Panel>
          <Grid>
            <Grid.Col span={6}>
              <TextInput label="Email" name="email" {...form.getInputProps("email")} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Phone" name="phone" {...form.getInputProps("phone")} />
            </Grid.Col>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default MailingAddressForm;

import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import { Card, Text } from "@mantine/core";

const FAQ = () => {
  return (
    <SectionContainer>
      <SectionTitle title="FAQ" id="faq" />
      <Card
        padding="lg"
        mt="xl"
        radius="md"
        style={{ display: "block", overflow: "auto" }}
      >
        <Text ta="center">
          Please check back before the wedding for more information!
        </Text>
      </Card>
    </SectionContainer>
  );
};

export default FAQ;

import { Card, Text, Flex, Anchor, Button } from "@mantine/core";
import { SectionContainer, SectionTitle } from "../../components/common";
import Image from "next/image";
import classes from "./registry.module.css";
import { IconExternalLink } from "@tabler/icons-react";

const Registry = (): JSX.Element => {
  return (
    <SectionContainer>
      <SectionTitle title="Registry" id="registry" />
      <Card
        padding="lg"
        mt="xl"
        radius="md"
        style={{ display: "block", overflow: "auto" }}
      >
        <Text mb="sm">
          We are so grateful to have you share in our special day. Your presence is our
          gift!
        </Text>
        <Text>Thanks for visiting and we can&apos;t wait to see you on our big day!</Text>

        <Flex justify="center">
          <Image
            src="/assets/images/The-Spielbergers.webp"
            alt="The Spielbergers family portrait"
            height={350}
            width={350}
            className={classes.familyPortrait}
          />
        </Flex>
      </Card>
    </SectionContainer>
  );
};

export default Registry;

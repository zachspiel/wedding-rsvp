import { Card, Text, Flex, Anchor, Button } from "@mantine/core";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";
import Image from "next/image";
import classes from "./registry.module.css";
import { IconExternalLink } from "@tabler/icons-react";

const Registry = (): JSX.Element => {
  return (
    <SectionContainer id="registry">
      <SectionTitle title="Registry" />
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
        <Text mb="sm">
          For those of you who are stubborn, we will be accepting contributions to our
          honeymoon fund at our reception following the ceremony.
          <Anchor href="https://withjoy.com/sedona-and-zach/registry" target="_blank">
            {" "}
            We&apos;ve also put together a wish-list to help you out
          </Anchor>
          . Our dream honeymoon would be in St. Lucia. Anything you want to contribute is
          greatly appreciated!
        </Text>
        <Text mb="sm">
          Please note that if you would like to purchase a physical item, you will need to
          ship it to yourself and bring it to the reception or reach out to Sedona and
          Zach for their address.
        </Text>
        <Text>Thanks for visiting and we can&apos;t wait to see you on our big day!</Text>

        <Anchor href="https://withjoy.com/sedona-and-zach/registry" target="_blank">
          <Button className="primaryButton" rightSection={<IconExternalLink />} mt="md">
            Open registry
          </Button>
        </Anchor>

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

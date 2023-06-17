import React from "react";
import { Card, Text } from "@mantine/core";
import SectionTitle from "../../components/common/SectionTitle";

const Registry = (): JSX.Element => {
  return (
    <>
      <SectionTitle title="Registry" id="registry" />
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text mb="sm">
          We are so grateful to have you share in our special day. Your presence is our
          gift!
        </Text>
        <Text mb="sm">
          We&apos;re lucky to already have a home full of everything we need. If you wish
          to contribute beyond your attendance, we will be accepting contributions to our
          honeymoon and first home fund at our reception following the ceremony.
        </Text>
        <Text>Thanks for visiting and we can&apos;t wait to see you on our big day!</Text>
      </Card>
    </>
  );
};

export default Registry;

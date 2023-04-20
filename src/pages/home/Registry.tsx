import React from "react";
import { Card, Container, Image, SimpleGrid, Text } from "@mantine/core";
import SectionTitle from "../../components/common/SectionTitle";
import logo from "../../assets/images/The Spielbergers Wedding Logo.png";

const Registry = (): JSX.Element => {
  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
          <SectionTitle title="Registry" id="registry" />
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text weight={500} mb="sm">
              We are so grateful to have you share in our special day. Your presence is
              our gift!
            </Text>
            <Text weight={500} mb="sm">
              {`We're lucky to already have a home full of everything we need. If you wish to
            contribute beyond your attendance, we will be accepting contributions to our
            honeymoon and first home fund at our reception following the ceremony.`}
            </Text>
            <Text weight={500}>
              {`Thanks for visiting and we can't wait to see you on our big day!`}
            </Text>
            <Card.Section>
              <Image
                src={logo}
                height={160}
                alt="Spielberger Wedding Logo"
                fit="contain"
                mt="sm"
                mb="sm"
              />
            </Card.Section>
          </Card>
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default Registry;

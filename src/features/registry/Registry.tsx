import React from "react";
import { Container, SimpleGrid, Text, Title } from "@mantine/core";

const Registry = (): JSX.Element => {
  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1}>
          <Title
            order={2}
            size="h1"
            sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
            weight={900}
            align="left"
            id="registry"
          >
            Registry
          </Title>

          <Text>
            We are so grateful to have you share in our special day. Your presence is our
            gift!
          </Text>
          <Text>
            We're lucky to already have a home full of everything we need. If you wish to
            contribute beyond your attendance, we will be accepting contributions to our
            honeymoon and first home fund at our reception following the ceremony.
          </Text>
          <Text>Thanks for visiting and we can't wait to see you on our big day!</Text>
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default Registry;

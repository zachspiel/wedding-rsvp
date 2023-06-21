"use client";

import { Container, SimpleGrid } from "@mantine/core";

interface Props {
  children: React.ReactNode;
  grayBackground?: boolean;
}

const SectionContainer = (props: Props): JSX.Element => {
  return (
    <Container sx={{ backgroundColor: props.grayBackground ? "#f7f7f7" : "" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} sx={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
          {props.children}
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default SectionContainer;

import React from "react";
import { Container, List, SimpleGrid, Title } from "@mantine/core";
import {
  IconBuildingCottage,
  IconCalendarEvent,
  IconMapPin,
  IconTie,
} from "@tabler/icons";
import WeddingCountdown from "./Countdown";
import Map from "./Map";

const WhenAndWhere = (): JSX.Element => {
  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1}>
          <Title
            order={2}
            size="h1"
            sx={(theme) => ({ fontFamily: `Poppins, sans-serif`, paddingTop: "2rem" })}
            weight={900}
            align="left"
            id="whenAndWhere"
          >
            When & Where
          </Title>
          <List spacing="xs" size="sm" center>
            <List.Item icon={<IconCalendarEvent strokeWidth="0.75" />}>
              <Title order={2} weight={300}>
                October 26th, 2024
              </Title>
            </List.Item>
            <List.Item icon={<IconBuildingCottage strokeWidth="0.75" />}>
              <Title order={2} weight={300}>
                The Wright House
              </Title>
            </List.Item>
            <List.Item icon={<IconMapPin strokeWidth="0.75" />}>
              <Title order={2} weight={300}>
                636 W University Dr, Mesa, AZ 85201
              </Title>
            </List.Item>
            <List.Item icon={<IconTie strokeWidth="0.75" />}>
              <Title order={2} weight={300}>
                Semi-formal
              </Title>
            </List.Item>
          </List>
          <Map />
          <WeddingCountdown />
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default WhenAndWhere;

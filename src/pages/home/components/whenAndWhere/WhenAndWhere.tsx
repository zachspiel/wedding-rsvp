import React from "react";
import { Container, List, SimpleGrid, Title } from "@mantine/core";
import {
  IconBuildingCottage,
  IconCalendarEvent,
  IconMapPin,
  IconTie,
  TablerIcon,
} from "@tabler/icons";
import WeddingCountdown from "./Countdown";
import Map from "./Map";

const WhenAndWhere = (): JSX.Element => {
  const createListItem = (label: string, icon: TablerIcon): JSX.Element => {
    return (
      <List.Item icon={icon({ strokeWidth: "0.75" })}>
        <Title order={2} weight={300}>
          {label}
        </Title>
      </List.Item>
    );
  };

  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1}>
          <Title
            order={2}
            size="h1"
            sx={(theme): Record<string, string> => ({
              fontFamily: `Poppins, sans-serif`,
              paddingTop: "2rem",
            })}
            weight={900}
            align="left"
            id="whenAndWhere"
          >
            When & Where
          </Title>
          <List spacing="xs" size="sm" center>
            {createListItem("October 26th, 2024", IconCalendarEvent)}
            {createListItem("The Wright House", IconBuildingCottage)}
            {createListItem("636 W University Dr, Mesa, AZ 85201", IconMapPin)}
            {createListItem("Semi-formal", IconTie)}
          </List>
          <Map />
          <WeddingCountdown />
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default WhenAndWhere;

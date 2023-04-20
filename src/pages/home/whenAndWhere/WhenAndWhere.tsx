import React from "react";
import { Container, List, SimpleGrid, Title, useMantineTheme } from "@mantine/core";
import {
  IconBuildingCottage,
  IconCalendarEvent,
  IconMapPin,
  IconTie,
  TablerIcon,
} from "@tabler/icons";
import WeddingCountdown from "./Countdown";
import Map from "./Map";
import SectionTitle from "../../../components/common/SectionTitle";
import { useMediaQuery } from "@mantine/hooks";

const WhenAndWhere = (): JSX.Element => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const createListItem = (label: string, icon: TablerIcon): JSX.Element => {
    return (
      <List.Item icon={icon({ strokeWidth: "0.75" })}>
        <Title order={isMobile ? 4 : 2} weight={300}>
          {label}
        </Title>
      </List.Item>
    );
  };

  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} pt="lg">
          <SectionTitle id="whenAndWhere" title="When and Where" />
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

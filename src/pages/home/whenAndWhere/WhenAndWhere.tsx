import React from "react";
import { Anchor, Container, List, SimpleGrid, Text } from "@mantine/core";
import {
  IconBuildingCottage,
  IconCalendarEvent,
  IconExternalLink,
  IconMapPin,
  IconTie,
  TablerIcon,
} from "@tabler/icons";
import WeddingCountdown from "./Countdown";
import SectionTitle from "../../../components/common/SectionTitle";

const GOOGLE_MAPS_URL = "https://goo.gl/maps/BtzfDmV1pqNAbrRE6";

const WhenAndWhere = (): JSX.Element => {
  const createListItem = (label: string, icon: TablerIcon, url?: string): JSX.Element => {
    return (
      <List.Item icon={icon({ strokeWidth: "1.3" })}>
        {url && (
          <Anchor href={url} target="_blank" color="normal" fz="lg" display="flex">
            {label}
            <IconExternalLink />
          </Anchor>
        )}
        {!url && <Text fz="lg">{label}</Text>}
      </List.Item>
    );
  };

  return (
    <Container sx={{ backgroundColor: "#f7f7f7" }} fluid>
      <Container sx={{ padding: "0" }}>
        <SimpleGrid cols={1} pt="lg">
          <SectionTitle id="whenAndWhere" title="When & Where" />
          <List spacing="xs" size="sm" center>
            {createListItem("October 26th, 2024", IconCalendarEvent)}
            {createListItem("The Wright House", IconBuildingCottage)}
            {createListItem(
              "636 W University Dr, Mesa, AZ 85201",
              IconMapPin,
              GOOGLE_MAPS_URL,
            )}
            {createListItem("Semi-formal", IconTie)}
          </List>
          <WeddingCountdown />
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default WhenAndWhere;

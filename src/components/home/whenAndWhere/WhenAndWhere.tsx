"use client";

import { Anchor, List, Text } from "@mantine/core";
import {
  IconBuildingCottage,
  IconCalendarEvent,
  IconExternalLink,
  IconMapPin,
  IconTie,
  TablerIconsProps,
} from "@tabler/icons-react";
import WeddingCountdown from "./Countdown";
import { SectionContainer, SectionTitle } from "@spiel-wedding/common";

const GOOGLE_MAPS_URL = "https://goo.gl/maps/BtzfDmV1pqNAbrRE6";

type TablerIcon = (props: TablerIconsProps) => JSX.Element;

const WhenAndWhere = (): JSX.Element => {
  const createListItem = (label: string, icon: TablerIcon, url?: string): JSX.Element => {
    return (
      <List.Item>
        {url && (
          <Anchor
            href={url}
            target="_blank"
            style={{ color: "inherit" }}
            fz="lg"
            display="flex"
          >
            {label}
            <IconExternalLink />
          </Anchor>
        )}
        {!url && <Text fz="lg">{label}</Text>}
      </List.Item>
    );
  };

  return (
    <SectionContainer grayBackground>
      <SectionTitle id="whenAndWhere" title="When & Where" />
      <List spacing="xs" size="sm" center>
        {createListItem("October 26th, 2024", IconCalendarEvent)}
        {createListItem("The Wright House", IconBuildingCottage)}
        {createListItem(
          "636 W University Dr, Mesa, AZ 85201",
          IconMapPin,
          GOOGLE_MAPS_URL
        )}
        {createListItem("Semi-formal", IconTie)}
      </List>
      <WeddingCountdown />
    </SectionContainer>
  );
};

export default WhenAndWhere;

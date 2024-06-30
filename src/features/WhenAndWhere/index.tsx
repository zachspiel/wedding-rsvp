"use client";

import { Anchor, em, Flex, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MAP_URL } from "@spiel-wedding/components/common/constants";
import { SectionContainer, SectionTitle } from "../../components/common";
import WeddingCountdown from "./components/Countdown";
import classes from "./styles.module.css";

const WhenAndWhere = (): JSX.Element => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <SectionContainer greenBackground>
      <SectionTitle title="When & Where" id="whenAndWhere" />
      <Flex direction="column" justify="center" ta="center" mb="xl">
        <Title
          size={isMobile ? "h4" : "h2"}
          order={2}
          mb="md"
          fw={400}
          className={classes.dividerTop}
        >
          The Wright House • Garden Ballroom
        </Title>
        <Title size={isMobile ? "h4" : "h2"} order={2} mb="md" fw={400}>
          <Anchor
            href={MAP_URL}
            target="_blank"
            style={{ color: "inherit" }}
            fz="inherit"
          >
            636 W University Dr, Mesa, AZ 85201
          </Anchor>
        </Title>
        <Title size={isMobile ? "h4" : "h2"} order={2} mb="md" fw={400}>
          Formal Attire
        </Title>
        <Title
          size={isMobile ? "h4" : "h2"}
          order={2}
          fw={400}
          className={classes.dividerBottom}
        >
          October 26th, 2024
        </Title>
      </Flex>
      <WeddingCountdown />
    </SectionContainer>
  );
};

export default WhenAndWhere;

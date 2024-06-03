"use client";

import { Anchor, em, Flex, Title } from "@mantine/core";
import WeddingCountdown from "./components/Countdown";
import { SectionContainer, SectionTitle } from "../../components/common";
import { useMediaQuery } from "@mantine/hooks";
import { MAP_URL } from "@spiel-wedding/components/common/constants";
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
          <Anchor
            href={MAP_URL}
            target="_blank"
            style={{ color: "inherit" }}
            fz="inherit"
          >
            Antel Clubhouse • Grand Ballroom
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
          September 07, 2024
        </Title>
      </Flex>
      <WeddingCountdown />
    </SectionContainer>
  );
};

export default WhenAndWhere;

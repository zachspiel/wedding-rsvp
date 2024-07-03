import { Anchor, Flex } from "@mantine/core";
import { MAP_URL } from "@spiel-wedding/components/common/constants";
import { SectionContainer, SectionTitle } from "../../components/common";
import WeddingCountdown from "./components/Countdown";
import DetailTitle from "./components/DetailTitle";
import classes from "./styles.module.css";

const WhenAndWhere = (): JSX.Element => {
  return (
    <SectionContainer greenBackground>
      <SectionTitle title="When & Where" id="whenAndWhere" />
      <Flex direction="column" justify="center" ta="center" mb="xl">
        <DetailTitle
          detail="The Wright House • Garden Ballroom"
          className={classes.dividerTop}
        />

        <DetailTitle
          detail={
            <Anchor
              href={MAP_URL}
              target="_blank"
              style={{ color: "inherit" }}
              fz="inherit"
            >
              636 W University Dr, Mesa, AZ 85201
            </Anchor>
          }
        />

        <DetailTitle detail="Formal Attire" />

        <DetailTitle detail="October 26th, 2024" className={classes.dividerBottom} />
      </Flex>
      <WeddingCountdown />
    </SectionContainer>
  );
};

export default WhenAndWhere;

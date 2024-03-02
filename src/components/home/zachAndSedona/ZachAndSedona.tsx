import { Card, Flex, Title } from "@mantine/core";
import { SectionContainer } from "@spiel-wedding/common";
import classes from "./styles.module.css";

const ZachAndSedona = () => {
  return (
    <SectionContainer>
      <Card padding="sm" radius="md" my="xl" py="xl">
        <Flex direction="row" className={classes.flowerContainer}>
          <Flex direction="column" justify="center">
            <Title size="xl" className={classes.titleElement}>
              Sedona Rannells
            </Title>
            <Title className={classes.dividerText}>and</Title>
            <Title size="xl" className={classes.titleElement}>
              Zachary Spielberger
            </Title>
          </Flex>
        </Flex>
      </Card>
    </SectionContainer>
  );
};

export default ZachAndSedona;

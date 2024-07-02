import { Card, Flex, Title } from "@mantine/core";
import { SectionContainer } from "@spiel-wedding/components/common";
import MotionContainer from "@spiel-wedding/components/common/MotionContainer";
import cx from "clsx";
import classes from "./styles.module.css";

const ZachAndSedona = () => {
  return (
    <SectionContainer>
      <Card padding="sm" radius="md" my="xl" py="xl">
        <Flex direction="row" className={classes.flowerContainer}>
          <MotionContainer
            motionProps={{
              initial: { opacity: 0, x: 100 },
              whileInView: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.7,
                },
              },
            }}
          >
            <div className={cx(classes.flowerImage, classes.flowerContainerLeft)} />
          </MotionContainer>

          <Flex direction="column" justify="center">
            <MotionContainer
              motionProps={{
                initial: {
                  opacity: 0,
                  y: -100,
                },
                whileInView: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    delay: 0.2,
                  },
                },
              }}
            >
              <Title size="xl" className={classes.titleElement}>
                Sedona Rannells
              </Title>
            </MotionContainer>

            <MotionContainer
              motionProps={{
                initial: {
                  opacity: 0,
                },
                whileInView: {
                  opacity: 1,

                  transition: {
                    duration: 0.7,
                    delay: 0.7,
                  },
                },
              }}
            >
              <Title className={classes.dividerText}>and</Title>
            </MotionContainer>

            <MotionContainer
              motionProps={{
                initial: {
                  opacity: 0,

                  y: 100,
                },
                whileInView: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    delay: 0.2,
                  },
                },
              }}
            >
              <Title size="xl" className={classes.titleElement}>
                Zachary Spielberger
              </Title>
            </MotionContainer>
          </Flex>
          <MotionContainer
            motionProps={{
              initial: { opacity: 0, x: -100 },
              whileInView: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.7,
                },
              },
            }}
          >
            <div className={cx(classes.flowerImage, classes.flowerContainerRight)} />
          </MotionContainer>
        </Flex>
      </Card>
    </SectionContainer>
  );
};

export default ZachAndSedona;

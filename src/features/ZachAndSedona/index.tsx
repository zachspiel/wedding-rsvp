"use client";

import { Card, Flex, Title } from "@mantine/core";
import { SectionContainer } from "../../components/common";
import classes from "./styles.module.css";
import { motion } from "framer-motion";

const ZachAndSedona = () => {
  return (
    <SectionContainer>
      <Card padding="sm" radius="md" my="xl" py="xl">
        <Flex direction="row" className={classes.flowerContainer}>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.7,
              },
            }}
          >
            <div className={classes.flowerContainerLeft} />
          </motion.div>
          <Flex direction="column" justify="center">
            <motion.div
              initial={{
                opacity: 0,
                y: -100,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  delay: 0.2,
                },
              }}
            >
              <Title size="xl" className={classes.titleElement}>
                Sedona Rannells
              </Title>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,

                transition: {
                  duration: 0.7,
                  delay: 0.7,
                },
              }}
            >
              <Title className={classes.dividerText}>and</Title>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,

                y: 100,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  delay: 0.2,
                },
              }}
            >
              <Title size="xl" className={classes.titleElement}>
                Zachary Spielberger
              </Title>
            </motion.div>
          </Flex>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.7,
              },
            }}
          >
            <div className={classes.flowerContainerRight} />
          </motion.div>
        </Flex>
      </Card>
    </SectionContainer>
  );
};

export default ZachAndSedona;

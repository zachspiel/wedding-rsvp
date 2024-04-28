"use client";

import { Container, Flex, Text } from "@mantine/core";
import Countdown, { CountdownRenderProps } from "react-countdown";
import classes from "../styles.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WeddingCountdown = (): JSX.Element => {
  const weddingDate = new Date("10/26/2024");
  const currentDate = new Date();
  const differenceInTime = weddingDate.getTime() - currentDate.getTime();
  const daysRemaining = differenceInTime / (1000 * 3600 * 24);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getCountdownBox = (
    title: string,
    value: number,
    index: number,
    className?: string,
  ): JSX.Element => {
    return (
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
            delay: 0.1 * index,
          },
        }}
        viewport={{ once: true }}
      >
        <Container
          style={{
            border: "none",
            width: "fit-content",
            float: "none",
            minWidth: "110px",
            borderRadius: "var(--mantine-radius-sm)",
          }}
          bg="sage-green"
          c="white"
          m={0}
          className={className}
        >
          <Text fz="xl" fw={300} ta="center">
            {value}
          </Text>
          <Text fz="xl" fw={700} ta="center">
            {title}
          </Text>
        </Container>
      </motion.div>
    );
  };

  const renderCountdown = ({ hours, minutes }: CountdownRenderProps): JSX.Element => {
    return (
      <Flex className={classes.countdownContainer} wrap="wrap" gap="md">
        {getCountdownBox("Days", Math.ceil(daysRemaining), 1)}
        {getCountdownBox("Hours", hours, 2, classes.countdownContainerMiddle)}
        {getCountdownBox("Minutes", minutes, 3)}
      </Flex>
    );
  };

  return <>{isLoaded && <Countdown date={weddingDate} renderer={renderCountdown} />}</>;
};

export default WeddingCountdown;

"use client";

import { Container, Flex, Text } from "@mantine/core";
import Countdown, { CountdownRenderProps } from "react-countdown";
import classes from "../styles.module.css";
import { useEffect, useState } from "react";

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
    className?: string
  ): JSX.Element => {
    return (
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
    );
  };

  const renderCountdown = ({ hours, minutes }: CountdownRenderProps): JSX.Element => {
    return (
      <Flex className={classes.countdownContainer} wrap="wrap" gap="md">
        {getCountdownBox("Days", Math.ceil(daysRemaining))}
        {getCountdownBox("Hours", hours, classes.countdownContainerMiddle)}
        {getCountdownBox("Minutes", minutes)}
      </Flex>
    );
  };

  return <>{isLoaded && <Countdown date={weddingDate} renderer={renderCountdown} />}</>;
};

export default WeddingCountdown;

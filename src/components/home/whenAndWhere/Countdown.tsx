"use client";

import { Container, Flex, Text, useMantineTheme } from "@mantine/core";
import Countdown, { CountdownRenderProps } from "react-countdown";
import classes from "./countdown.module.css";
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

  const getCountdownBox = (title: string, value: number): JSX.Element => {
    return (
      <Container
        style={{
          border: "none",
          width: "fit-content",
          float: "none",
          minWidth: "100px",
          margin: "25px 0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Text fz="lg" fw={300} style={{ textAlign: "center" }}>
          {value}
        </Text>
        <Text fz="lg" fw={700} style={{ textAlign: "center" }}>
          {title}
        </Text>
      </Container>
    );
  };

  const renderCountdown = ({ hours, minutes }: CountdownRenderProps): JSX.Element => {
    return (
      <Flex className={classes.countdownContainer} wrap="wrap" gap="md">
        {getCountdownBox("Days", Math.ceil(daysRemaining))}
        {getCountdownBox("Hours", hours)}
        {getCountdownBox("Minutes", minutes)}
      </Flex>
    );
  };

  return <>{isLoaded && <Countdown date={weddingDate} renderer={renderCountdown} />}</>;
};

export default WeddingCountdown;

"use client";

import { Container, Flex, Text } from "@mantine/core";
import MotionContainer from "@spiel-wedding/components/common/MotionContainer";
import { useEffect, useState } from "react";
import classes from "../styles.module.css";

interface CountdownTimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

const WEDDING_DATE = new Date("10/26/2024");

const WeddingCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTimeLeft | undefined>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft(): CountdownTimeLeft | undefined {
    const currentDate = new Date();
    const difference = WEDDING_DATE.getTime() - currentDate.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
  }

  const getCountdownBox = (
    title: string,
    value: number,
    index: number,
    className?: string
  ): JSX.Element => {
    return (
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
              delay: 0.1 * index,
            },
          },
          viewport: { once: true },
        }}
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
      </MotionContainer>
    );
  };

  if (!timeLeft) {
    return null;
  }

  return (
    <Flex className={classes.countdownContainer} wrap="wrap" gap="md">
      {getCountdownBox("Days", timeLeft.days, 1)}
      {getCountdownBox("Hours", timeLeft.hours, 2, classes.countdownContainerMiddle)}
      {getCountdownBox("Minutes", timeLeft.minutes, 3)}
    </Flex>
  );
};

export default WeddingCountdown;

import React from "react";
import { Container, Flex, Title, useMantineTheme } from "@mantine/core";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useMediaQuery } from "@mantine/hooks";

const WeddingCountdown = (): JSX.Element => {
  const weddingDate = new Date("10/12/2024");
  const currentDate = new Date();
  const differenceInTime = weddingDate.getTime() - currentDate.getTime();
  const daysRemaining = differenceInTime / (1000 * 3600 * 24);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    return (
      <Flex justify={mobile ? "flex-start" : "center"} wrap="wrap" sx={{paddingBottom: "5rem"}} gap="md">
        <Container
          sx={{
            border: "none",
            width: "fit-content",
            float: "none",
            minWidth: "100px",
            margin: "25px 0",
            backgroundColor: " #FFF",
          }}
        >
          <Title order={4} weight={300} align="center">
            {Math.ceil(daysRemaining)}
          </Title>
          <Title order={4} align="center">
            Days
          </Title>
        </Container>
        <Container
          sx={{
            border: "none",
            width: "fit-content",
            float: "none",
            minWidth: "100px",
            margin: "25px 0",
            backgroundColor: " #FFF",
          }}
        >
          <Title order={4} weight={300} align="center">
            {hours}
          </Title>
          <Title order={4} align="center">
            Hours
          </Title>
        </Container>
        <Container
          sx={{
            border: "none",
            width: "fit-content",
            float: "none",
            margin: "25px 0",
            backgroundColor: " #FFF",
          }}
        >
          <Title order={4} weight={300} align="center">
            {minutes}
          </Title>
          <Title order={4} align="center">
            Minutes
          </Title>
        </Container>
      </Flex>
    );
  };

  return <Countdown date={weddingDate} renderer={renderCountdown} />;
};

export default WeddingCountdown;

import { Container, Flex, Text, useMantineTheme } from "@mantine/core";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useMediaQuery } from "@mantine/hooks";

const WeddingCountdown = (): JSX.Element => {
  const weddingDate = new Date("10/26/2024");
  const currentDate = new Date();
  const differenceInTime = weddingDate.getTime() - currentDate.getTime();
  const daysRemaining = differenceInTime / (1000 * 3600 * 24);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const getCountdownBox = (title: string, value: number): JSX.Element => {
    return (
      <Container
        sx={{
          border: "none",
          width: "fit-content",
          float: "none",
          minWidth: "100px",
          margin: "25px 0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Text fz="lg" fw={300} align="center">
          {value}
        </Text>
        <Text fz="lg" fw={700} align="center">
          {title}
        </Text>
      </Container>
    );
  };

  const renderCountdown = ({ hours, minutes }: CountdownRenderProps): JSX.Element => {
    return (
      <Flex
        justify={mobile ? "flex-start" : "center"}
        wrap="wrap"
        sx={{ paddingBottom: "5rem" }}
        gap="md"
      >
        {getCountdownBox("Days", Math.ceil(daysRemaining))}
        {getCountdownBox("Hours", hours)}
        {getCountdownBox("Minutes", minutes)}
      </Flex>
    );
  };

  return <Countdown date={weddingDate} renderer={renderCountdown} />;
};

export default WeddingCountdown;

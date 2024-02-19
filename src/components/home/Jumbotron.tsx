import { Container, Title, Text } from "@mantine/core";
import classes from "./home.module.css";

const Jumbotron = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}>
        <Title className={classes.title}>We&apos;re Getting Married!</Title>

        <Container size={500}>
          <Text size="xl" className={classes.description}>
            Sedona & Zach
          </Text>
        </Container>

        <Text size="lg" className={classes.description}>
          10.26.24
        </Text>
      </div>
    </div>
  );
};

export default Jumbotron;

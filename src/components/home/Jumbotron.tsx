import { Overlay, Container, Title, Text } from "@mantine/core";
import classes from "./home.module.css";

const Jumbotron = (): JSX.Element => {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.25} zIndex={0} />

      <div className={classes.inner}>
        <Title
          className={classes.title}
          style={{
            fontFamily: `Brittany, sans-serif`,
          }}
        >
          {"We're Getting Married!"}
        </Title>

        <Container size={640}>
          <Text
            size="lg"
            className={classes.description}
            style={{
              fontFamily: `Poppins, sans-serif`,
            }}
          >
            Sedona & Zach
          </Text>
        </Container>

        <Text
          size="lg"
          className={classes.description}
          style={{
            fontFamily: `Poppins, sans-serif`,
            textAlign: "center",
          }}
        >
          10.26.24
        </Text>
      </div>
    </div>
  );
};

export default Jumbotron;

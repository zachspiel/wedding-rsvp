import React from "react";
import { createStyles, Overlay, Container, Title, Text } from "@mantine/core";
import jumbotronImage from "../../assets/images/jumbotron.webp";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    backgroundImage: `url(${jumbotronImage})`,

    [theme.fn.largerThan("lg")]: {
      backgroundAttachment: "fixed",
    },
    [theme.fn.largerThan("md")]: {
      paddingTop: 750,
      paddingBottom: 100,
      backgroundSize: "cover",
    },
    [theme.breakpoints.md]: {
      paddingTop: 400,
      paddingBottom: 20,
      backgroundSize: "contain",
      backgroundPositionY: "65px",
    },
    [theme.fn.smallerThan("md")]: {
      paddingTop: 250,
      paddingBottom: 20,
      backgroundSize: "cover",
    },
  },

  inner: {
    position: "relative",
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    "@media (max-width: 520px)": {
      fontSize: 28,
    },
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: "center",
    marginBottom: theme.spacing.xs,

    "@media (max-width: 520px)": {
      fontSize: theme.fontSizes.md,
    },
  },
}));

const Jumbotron = (): JSX.Element => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.45} zIndex={0} />

      <div className={classes.inner}>
        <Title
          className={classes.title}
          sx={(theme): Record<string, string> => ({
            fontFamily: `Brittany, sans-serif`,
          })}
        >
          {"We're Getting Married!"}
        </Title>

        <Container size={640}>
          <Text
            size="lg"
            className={classes.description}
            sx={(theme): Record<string, string> => ({
              fontFamily: `Poppins, sans-serif`,
            })}
          >
            Sedona & Zach
          </Text>
        </Container>

        <Text
          align="center"
          size="lg"
          className={classes.description}
          sx={(theme): Record<string, string> => ({
            fontFamily: `Poppins, sans-serif`,
          })}
        >
          10.26.24
        </Text>
      </div>
    </div>
  );
};

export default Jumbotron;

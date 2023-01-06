import React from "react";
import { createStyles, Overlay, Container, Title, Text } from "@mantine/core";
import engagement from "../../images/engagement.jpg";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 700,
    paddingBottom: 100,
    backgroundImage: `url(${engagement})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",

    "@media (max-width: 520px)": {
      paddingTop: 80,
      paddingBottom: 50,
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
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
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: "center",
    marginBottom: theme.spacing.xs,

    "@media (max-width: 520px)": {
      fontSize: theme.fontSizes.md,
      textAlign: "left",
    },
  },
}));

const Jumbotron = (): JSX.Element => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.45} zIndex={1} />

      <div className={classes.inner}>
        <Title
          className={classes.title}
          sx={(theme) => ({ fontFamily: `Brittany, sans-serif` })}
        >
          We're Getting Married!
        </Title>

        <Container size={640}>
          <Text
            size="lg"
            className={classes.description}
            sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
          >
            Sedona & Zach
          </Text>
        </Container>

        <Text
          align="center"
          size="lg"
          className={classes.description}
          sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
        >
          10.12.24
        </Text>
      </div>
    </div>
  );
};

export default Jumbotron;

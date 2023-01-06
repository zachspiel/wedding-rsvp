import React from "react";
import { Anchor, Container, createStyles, Group } from "@mantine/core";
import roses from "../../images/blush-rose.png";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundImage: `url(${roses})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

const Footer = (): JSX.Element => {
  const { classes } = useStyles();
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={classes.links}>
          <Anchor<"a">
            color="dimmed"
            href={""}
            onClick={(event) => event.preventDefault()}
            size="sm"
          >
            WHEN & WHERE
          </Anchor>
          <Anchor<"a">
            color="dimmed"
            href={""}
            onClick={(event) => event.preventDefault()}
            size="sm"
          >
            GALLERY
          </Anchor>
          <Anchor<"a">
            color="dimmed"
            href={""}
            onClick={(event) => event.preventDefault()}
            size="sm"
          >
            GUEST BOOK
          </Anchor>
          <Anchor<"a">
            color="dimmed"
            href={""}
            onClick={(event) => event.preventDefault()}
            size="sm"
          >
            RSVP
          </Anchor>
        </Group>
      </Container>
    </div>
  );
};

export default Footer;

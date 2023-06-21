"use client";
import { createStyles, Container, Group, Anchor, rem } from "@mantine/core";
import { links } from "./links";
import Logo from "./Logo";

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
    [theme.fn.largerThan("sm")]: {
      backgroundImage: `url(/assets/images/blush-rose.webp)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  links: {
    justifyContent: "center",
    textAlign: "center",
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

const Footer = (): JSX.Element => {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<"a"> color="dimmed" key={link.label} href={link.link} size="md">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Logo />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
};

export default Footer;

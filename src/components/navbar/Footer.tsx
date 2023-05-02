import React from "react";
import { createStyles, Container, Group, Anchor, rem, Image } from "@mantine/core";
import logo from "../../assets/images/The Spielbergers Wedding Logo Variant.png";
import { links } from "./links";

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  const items = links.map((link) => (
    <Anchor<"a"> color="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Image src={logo} width={56} height={56} alt="The Spielbergers Wedding Logo" />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
};

export default Footer;

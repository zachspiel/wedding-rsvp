import React from "react";
import { createStyles, Header, Container, Group, Anchor } from "@mantine/core";
import roses from "../../images/blush-rose.png";

const useStyles = createStyles((theme) => ({
  container: {
    backgroundImage: `url(${roses})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string; variant?: "link" | "text" | "gradient" }[];
}

const Navbar = ({ links }: HeaderSimpleProps): JSX.Element => {
  const { classes } = useStyles();

  const items = links.map((link, index) => (
    <Anchor
      key={`${link.label}-${index}`}
      href={link.link}
      size="sm"
      id={link.label}
      variant={link.variant ?? "text"}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <Header height={80} className={classes.container}>
      <Container className={classes.header}>
        <Group spacing={25}>{items}</Group>
      </Container>
    </Header>
  );
};

export default Navbar;

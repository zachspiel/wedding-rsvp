import React from "react";
import { createStyles, Header, Container, Group, Burger, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
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
  links: { link: string; label: string }[];
}

const Navbar = ({ links }: HeaderSimpleProps): JSX.Element => {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = links.map((link, index) => (
    <Anchor<"a">
      sx={{ color: "#000000" }}
      key={`${link.label}-${index}`}
      href={link.link}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));
  return (
    <Header height={80} className={classes.container}>
      <Container className={classes.header}>
        <Group spacing={25} className={classes.links}>
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
      </Container>
    </Header>
  );
};

export default Navbar;

import React from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Button,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useSignInStatus from "../../hooks/signInStatus";
import { auth } from "../../database/database";
import { MenuItem, links } from "./links";
import roses from "../../assets/images/blush-rose.webp";
import Logo from "./Logo";

const HEADER_HEIGHT = rem(60);

interface Props {
  showHome?: boolean;
}

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,

    [theme.fn.largerThan("sm")]: {
      backgroundImage: `url(${roses})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    [theme.fn.largerThan("sm")]: {
      justifyContent: "center",
    },
    [theme.fn.smallerThan("sm")]: {
      justifyContent: "space-between",
    },
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    color: theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.pink[0],
      textDecoration: "none",
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  highlightedLink: {
    backgroundColor: theme.colors.pink[4],
    color: "#ffffff",
    "&:hover": {
      backgroundColor: theme.colors.pink[3],
    },
  },
}));

const Navbar = (props: Props): JSX.Element => {
  const { classes, cx } = useStyles();
  const { isSignedIn } = useSignInStatus();

  const [opened, { toggle, close }] = useDisclosure(false);
  const createMenuItem = (menuItem: MenuItem): JSX.Element => {
    return (
      <Anchor<"a">
        href={menuItem.link}
        key={menuItem.label}
        onClick={close}
        className={cx(
          classes.link,
          menuItem.className,
          menuItem.label === "RSVP" ? classes.highlightedLink : undefined,
        )}
      >
        {menuItem.label}
      </Anchor>
    );
  };

  const menuItems = React.useMemo(() => {
    const elements = links.map(createMenuItem);

    if (isSignedIn) {
      elements.push(createMenuItem({ label: "Guest List", link: "/guestList" }));
    }

    if (props.showHome) {
      elements.unshift(createMenuItem({ label: "Home", link: "/" }));
    }

    return elements;
  }, [links, isSignedIn]);

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header} sx={{ maxWidth: "100%" }}>
        <Logo />
        <Group spacing={5} className={classes.links}>
          {menuItems}
          {isSignedIn && (
            <Button
              className={classes.highlightedLink}
              onClick={(): Promise<void> => auth.signOut()}
            >
              Sign out
            </Button>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles): JSX.Element => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {menuItems}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default Navbar;

"use client";

import {
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
import useSignInStatus from "@spiel-wedding/hooks/signInStatus";
import { MenuItem, links } from "./links";
import Logo from "./Logo";
import { useMemo } from "react";
import classes from "./navbar.module.css";
import cx from "clsx";
import { AdminViewToggle } from "@spiel-wedding/common";
import { supabase } from "@spiel-wedding/database/database";

const HEADER_HEIGHT = rem(100);

interface Props {
  showHome?: boolean;
}

const Navbar = (props: Props): JSX.Element => {
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
          menuItem.label === "RSVP" ? classes.highlightedLink : undefined
        )}
      >
        {menuItem.label}
      </Anchor>
    );
  };

  const menuItems = useMemo(() => {
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
    <header style={{ height: HEADER_HEIGHT }} className={classes.root}>
      <Container className={classes.header} style={{ maxWidth: "100%" }}>
        <Anchor href="/" p="xs">
          <Logo />
        </Anchor>
        <Group gap="md" className={classes.links}>
          {menuItems}
          {isSignedIn && (
            <Button
              className={classes.highlightedLink}
              onClick={async () => await supabase.auth.signOut({ scope: "local" })}
            >
              Sign out
            </Button>
          )}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          name="Navbar menu button"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles): JSX.Element => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {menuItems}
            </Paper>
          )}
        </Transition>
      </Container>

      {isSignedIn && <AdminViewToggle />}
    </header>
  );
};

export default Navbar;

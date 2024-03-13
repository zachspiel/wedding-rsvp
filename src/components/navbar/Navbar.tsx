"use client";

import {
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Anchor,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./Logo";
import { useMemo } from "react";
import { AdminViewToggle, MenuItem, links } from "@spiel-wedding/common";
import cx from "clsx";
import { createClient } from "@spiel-wedding/database/client";
import { User } from "@supabase/supabase-js";
import { IconLogout } from "@tabler/icons-react";
import { showFailureNotification } from "../notifications/notifications";
import { redirect } from "next/navigation";
import classes from "./navbar.module.css";

export const HEADER_HEIGHT = rem(100);

interface Props {
  user: User | null;
}

const Navbar = ({ user }: Props): JSX.Element => {
  const supabase = createClient();
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

    if (user) {
      elements.push(createMenuItem({ label: "Guest List", link: "/guestList" }));
    }

    return elements;
  }, [links, user]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      showFailureNotification();
    } else {
      redirect("/login");
    }
  };

  return (
    <header style={{ height: HEADER_HEIGHT }} className={classes.root}>
      <Container className={classes.header} style={{ maxWidth: "100%" }}>
        <Anchor href="/" p="xs">
          <Logo />
        </Anchor>
        <Group gap="md" className={classes.navbarLinks}>
          {menuItems}
          {user && (
            <ActionIcon variant="subtle" onClick={signOut}>
              <IconLogout />
            </ActionIcon>
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

      {user && <AdminViewToggle />}
    </header>
  );
};

export default Navbar;

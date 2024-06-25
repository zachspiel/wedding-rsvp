"use client";

import { Burger, Paper, Transition } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../navbar.module.css";
import MenuItems from "./MenuItems";

const BurgerMenu = (): JSX.Element => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        className={classes.burger}
        size="sm"
        aria-label="Navbar menu button"
      />
      <Transition transition="pop-top-right" duration={200} mounted={opened}>
        {(styles): JSX.Element => (
          <Paper className={classes.dropdown} withBorder style={styles}>
            <MenuItems onClick={close} />
          </Paper>
        )}
      </Transition>
    </>
  );
};

export default BurgerMenu;

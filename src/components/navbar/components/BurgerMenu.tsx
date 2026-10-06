"use client";

import { Burger, Paper, Transition } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactElement } from "react";
import classes from "../navbar.module.css";
import MenuItems from "./MenuItems";

const BurgerMenu = (): ReactElement => {
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
        {(styles): ReactElement => (
          <Paper className={classes.dropdown} withBorder style={styles}>
            <MenuItems onClick={close} />
          </Paper>
        )}
      </Transition>
    </>
  );
};

export default BurgerMenu;

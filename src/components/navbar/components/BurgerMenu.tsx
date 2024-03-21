"use client";

import { Burger, Transition, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../navbar.module.css";
import MenuItems from "./MenuItems";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User | null;
}

const BurgerMenu = ({ user }: Props): JSX.Element => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
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
            <MenuItems onClick={close} user={user} />
          </Paper>
        )}
      </Transition>
    </>
  );
};

export default BurgerMenu;

import { Anchor, Container, Group, rem } from "@mantine/core";
import { AdminViewToggle } from "../common";
import BurgerMenu from "./components/BurgerMenu";
import Logo from "./components/Logo";
import MenuItems from "./components/MenuItems";
import classes from "./navbar.module.css";

export const HEADER_HEIGHT = rem(100);

const Navbar = (): JSX.Element => {
  return (
    <header style={{ height: HEADER_HEIGHT }} className={classes.root}>
      <Container className={classes.header} style={{ maxWidth: "100%" }}>
        <Anchor href="/" p="xs">
          <Logo />
        </Anchor>
        <Group gap="sm" className={classes.navbarLinks}>
          <MenuItems />
        </Group>

        <BurgerMenu />
      </Container>

      <AdminViewToggle />
    </header>
  );
};

export default Navbar;

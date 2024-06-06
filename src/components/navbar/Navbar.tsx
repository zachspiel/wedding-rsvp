import { Container, Group, rem, Anchor } from "@mantine/core";
import Logo from "./components/Logo";
import { AdminViewToggle } from "../common";
import { User } from "@supabase/supabase-js";
import classes from "./navbar.module.css";
import MenuItems from "./components/MenuItems";
import BurgerMenu from "./components/BurgerMenu";

export const HEADER_HEIGHT = rem(80);

interface Props {
  user: User | null;
}

const Navbar = ({ user }: Props): JSX.Element => {
  return (
    <header style={{ height: HEADER_HEIGHT }} className={classes.root}>
      <Container className={classes.header} style={{ maxWidth: "100%" }}>
        <Anchor href="/" p="xs">
          <Logo />
        </Anchor>
        <Group gap="md" className={classes.navbarLinks}>
          <MenuItems user={user} />
        </Group>

        <BurgerMenu user={user} />
      </Container>

      {user && <AdminViewToggle />}
    </header>
  );
};

export default Navbar;

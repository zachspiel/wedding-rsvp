import React from "react";
import {
  Anchor,
  Center,
  Container,
  createStyles,
  Group,
  Menu,
} from "@mantine/core";
import roses from "../../images/blush-rose.png";
import useSignInStatus from "../../hooks/signInStatus";
import { IconChevronDown } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  navbar: {
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundImage: `url(${roses})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundImage: `url(${roses})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "fixed",
    width: "100%",
    bottom: "0",
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },

  guestListDropdown: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

interface Props {
  showHome?: boolean;
  footer?: boolean;
}

const Navbar = (props: Props): JSX.Element => {
  const { classes } = useStyles();
  const { isSignedIn } = useSignInStatus();

  const createAnchor = (label: string, link: string): JSX.Element => {
    return (
      <Anchor<"a"> color="dimmed" href={link} size="sm">
        {label}
      </Anchor>
    );
  };

  return (
    <div className={props.footer ? classes.footer : classes.navbar}>
      <Container className={classes.inner}>
        <Group className={classes.links}>
          {props.showHome && createAnchor("HOME", "/")}
          {createAnchor("WHEN & WHERE", "#whenAndWhere")}
          {createAnchor("RSVP", "#rsvp")}
          {createAnchor("GUEST BOOK", "#guestBook")}
          {createAnchor("GALLERY", "#gallery")}

          {isSignedIn && (
            <Menu trigger="hover" withinPortal>
              <Menu.Target>
                <Anchor<"a">
                  color="dimmed"
                  size="sm"
                  href="/guestList"
                  className={classes.guestListDropdown}
                >
                  <Center>
                    GUEST LIST
                    <IconChevronDown size="0.8rem" stroke={1.5} />
                  </Center>
                </Anchor>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Anchor<"a"> color="dimmed" href="/guestList" size="sm">
                    MANAGE GUEST LIST
                  </Anchor>
                </Menu.Item>
                <Menu.Item>
                  <Anchor<"a"> color="dimmed" href="/rsvps" size="sm">
                    TRACK RSVPs
                  </Anchor>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </div>
  );
};

export default Navbar;

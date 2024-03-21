"use client";

import { Anchor } from "@mantine/core";
import { MenuItem, links } from "@spiel-wedding/common";
import classes from "../navbar.module.css";
import cx from "clsx";
import { User } from "@supabase/supabase-js";
import SignOutButton from "./SignOutButton";

interface Props {
  user: User | null;
  onClick?: () => void;
}

const MenuItems = ({ user, onClick }: Props): JSX.Element => {
  const createMenuItem = (item: MenuItem) => {
    return (
      <Anchor<"a">
        href={item.link}
        key={item.label}
        onClick={onClick}
        className={cx(
          classes.link,
          item.className,
          item.label === "RSVP" ? classes.highlightedLink : undefined
        )}
      >
        {item.label}
      </Anchor>
    );
  };

  const createMenuItems = () => {
    const menuItems = links.map(createMenuItem);

    if (user) {
      menuItems.push(createMenuItem({ label: "Guest List", link: "/guestList" }));
    }

    return menuItems;
  };

  return (
    <>
      {createMenuItems()}
      <SignOutButton user={user} />
    </>
  );
};

export default MenuItems;

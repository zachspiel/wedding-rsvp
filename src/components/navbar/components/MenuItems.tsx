"use client";

import { Center, Menu } from "@mantine/core";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { IconChevronDown } from "@tabler/icons-react";
import cx from "clsx";
import { MenuItem, links } from "../../common";
import classes from "../navbar.module.css";
import SignOutButton from "./SignOutButton";

interface Props {
  onClick?: () => void;
}

const MenuItems = ({ onClick }: Props): JSX.Element => {
  const { user } = useAdminView();

  const createMenuLinks = (items: MenuItem[]) => {
    return items.map((link) => {
      const menuItems = link.links?.map((item) => (
        <Menu.Item key={item.link}>
          <a href={item.link} className={classes.adminLink}>
            {item.label}
          </a>
        </Menu.Item>
      ));

      if (menuItems) {
        return (
          <Menu
            key={link.label}
            trigger="hover"
            transitionProps={{ exitDuration: 0 }}
            withinPortal
          >
            <Menu.Target>
              <a href={link.link} onClick={onClick} className={classes.link}>
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                  <IconChevronDown size="0.9rem" stroke={1.5} />
                </Center>
              </a>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
          </Menu>
        );
      }

      return (
        <a
          key={link.label}
          href={link.link}
          onClick={onClick}
          className={cx(
            classes.link,
            link.className,
            link.label === "Upload Photos" ? classes.highlightedLink : undefined
          )}
        >
          {link.label}
        </a>
      );
    });
  };
  const createMenuItems = () => {
    const menuItems = [...links];

    if (user) {
      const adminMenuItem: MenuItem = {
        label: "Admin",
        links: [
          { label: "Events", link: "/events" },
          { label: "Guest List", link: "/guestList" },
        ],
      };

      menuItems.push(adminMenuItem);
    }

    return createMenuLinks(menuItems);
  };

  return (
    <>
      {createMenuItems()}
      <SignOutButton user={user} />
    </>
  );
};

export default MenuItems;

"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import cx from "clsx";
import classes from "../faq.module.css";

const DarkModeToggle = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  );
};

export default DarkModeToggle;

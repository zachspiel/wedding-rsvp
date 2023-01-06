import React from "react";
import { Switch, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";

const ThemeToggle = (): JSX.Element => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Switch
      checked={colorScheme === "dark"}
      onChange={() => toggleColorScheme()}
      size="lg"
      onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
      offLabel={<IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />}
    />
  );
};

export default ThemeToggle;

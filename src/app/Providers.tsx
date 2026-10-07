"use client";

import { DEFAULT_THEME, MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { displayEasterEggs } from "@spiel-wedding/components/easterEggs";
import { LazyMotion } from "framer-motion";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { ReactNode, useEffect } from "react";
import AdminViewProvider from "../context/AdminView";

const loadFeatures = () => import("../util/framerFeature").then((res) => res.default);

const theme = createTheme({
  fontFamily: `var(--font-poppins), ${DEFAULT_THEME.fontFamily}`,
  headings: {
    fontFamily: `var(--font-poppins), ${DEFAULT_THEME.headings.fontFamily}`,
  },
  colors: {
    "sage-green": [
      "#f6f6ec",
      "#e6eae4",
      "#ced0ca",
      "#b2b7ae",
      "#9ca196",
      "#8e9386",
      "#858c7d",
      "#72796a",
      "#656b5c",
      "#555d4b",
    ],
  },
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  primaryColor: "sage-green",
});

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    displayEasterEggs();
  }, []);

  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <LazyMotion strict features={loadFeatures}>
        <ModalsProvider>
          <AdminViewProvider>{children}</AdminViewProvider>
        </ModalsProvider>
        <Notifications />
      </LazyMotion>
    </MantineProvider>
  );
}

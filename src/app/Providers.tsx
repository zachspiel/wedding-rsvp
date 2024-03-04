"use client";

import AdminViewProvider from "../context/AdminView";
import SignInStatusProvider from "../context/SignInStatus";
import { DEFAULT_THEME, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { useEffect } from "react";
import { logBugReportLink } from "@spiel-wedding/components/easterEggs";

export function Providers({
  children,
  poppins,
}: {
  children: any;
  poppins: NextFontWithVariable;
}) {
  useEffect(() => {
    logBugReportLink();
  }, []);

  const theme = createTheme({
    fontFamily: poppins.style.fontFamily + "," + DEFAULT_THEME.fontFamily,
    headings: {
      fontFamily: poppins.style.fontFamily + "," + DEFAULT_THEME.headings.fontFamily,
    },
    breakpoints: {
      xs: "30em",
      sm: "48em",
      md: "64em",
      lg: "74em",
      xl: "90em",
    },
  });

  return (
    <MantineProvider defaultColorScheme="light" theme={theme} forceColorScheme="light">
      <Notifications />
      <SignInStatusProvider>
        <AdminViewProvider>{children}</AdminViewProvider>
      </SignInStatusProvider>
    </MantineProvider>
  );
}

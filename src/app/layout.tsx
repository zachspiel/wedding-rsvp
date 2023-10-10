import Navbar from "@spiel-wedding/components/navbar/Navbar";
import Footer from "@spiel-wedding/components/navbar/Footer";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "./theme";
import { Providers } from "./Providers";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";

export const metadata = {
  title: "Spielberger Wedding 2024",
  description: "The Spielbergers 2024",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}

import Navbar from "@spiel-wedding/components/navbar/Navbar";
import Footer from "@spiel-wedding/components/navbar/Footer";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "./theme";
import { Providers } from "./Providers";
import { Notifications } from "@mantine/notifications";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin"],
});

const brittanySignature = localFont({
  src: "../assets/fonts/BrittanySignature.ttf",
  display: "swap",
  variable: "--font-brittany",
});

export const metadata: Metadata = {
  title: "Spielberger Wedding 2024",
  metadataBase: new URL("https://zachandsedona.com"),
  description: "The Spielbergers 2024",
  creator: "Zachary Spielberger",
  keywords: ["The Spielbergers 2024"],
  openGraph: {
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${brittanySignature.variable}`}
    >
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta name="robots" content="all" />
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
        <Analytics />
      </body>
    </html>
  );
}

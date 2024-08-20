import "@mantine/carousel/styles.css";
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  rem,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Footer } from "@spiel-wedding/components/footer";
import { Navbar } from "@spiel-wedding/components/navbar";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const playfair = Playfair_Display({
  display: "swap",
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: "400",
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spielberger Wedding 2024",
  metadataBase: new URL("https://zachandsedona.com"),
  description: "We're getting married! Sedona Rannells and Zachary Spielberger 2024.",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable}`}>
      <head>
        <ColorSchemeScript />
        <meta name="robots" content="all" />
      </head>
      <body>
        <Providers poppins={poppins}>
          <AppShell header={{ height: rem(100) }}>
            <AppShellHeader>
              <Navbar />
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
            <AppShellFooter pos="relative" zIndex={10}>
              <Footer />
            </AppShellFooter>
          </AppShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

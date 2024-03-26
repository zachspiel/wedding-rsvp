import { ColorSchemeScript, rem } from "@mantine/core";
import { Providers } from "./Providers";
import { Metadata } from "next";
import { Playfair, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@spiel-wedding/components/navbar";
import { Footer } from "@spiel-wedding/components/footer";
import { createClient } from "@spiel-wedding/database/server";
import { AppShell, AppShellHeader, AppShellMain, AppShellFooter } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";

const playfair = Playfair({
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable}`}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="robots" content="all" />
      </head>
      <body>
        <Providers poppins={poppins}>
          <AppShell header={{ height: rem(100) }} style={{ overflow: "hidden" }}>
            <AppShellHeader>
              <Navbar user={user} />
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

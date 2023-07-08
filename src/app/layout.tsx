import AdminViewProvider from "@spiel-wedding/context/AdminView";
import SignInStatusProvider from "@spiel-wedding/context/SignInStatus";
import { MantineProvider } from "@mantine/core";
import Navbar from "@spiel-wedding/components/navbar/Navbar";
import "./globals.css";
import RootStyleRegistry from "./emotion";
import Footer from "@spiel-wedding/components/navbar/Footer";

export const metadata = {
  title: "Spielberger Wedding 2024",
  description: "The Spielbergers 2024",
  "og:image": "https://www.zachandsedona.com/assets/images/The-Spielbergers.webp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootStyleRegistry>
          <Navbar />
          {children}
          <Footer />
        </RootStyleRegistry>
      </body>
    </html>
  );
}

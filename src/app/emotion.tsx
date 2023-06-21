"use client";

import { CacheProvider } from "@emotion/react";
import { useEmotionCache, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import AdminViewProvider from "@spiel-wedding/context/AdminView";
import SignInStatusProvider from "@spiel-wedding/context/SignInStatus";
import { useServerInsertedHTML } from "next/navigation";

export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <SignInStatusProvider>
          <AdminViewProvider>
            {children}
            <Notifications position="top-right" />
          </AdminViewProvider>
        </SignInStatusProvider>
      </MantineProvider>
    </CacheProvider>
  );
}

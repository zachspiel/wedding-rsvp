"use client";

import AdminViewProvider from "../context/AdminView";
import SignInStatusProvider from "../context/SignInStatus";

export function Providers({ children }: { children: any }) {
  return (
    <SignInStatusProvider>
      <AdminViewProvider>{children}</AdminViewProvider>
    </SignInStatusProvider>
  );
}

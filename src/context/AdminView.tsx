"use client";

import { createClient } from "@spiel-wedding/database/client";
import { AdminContextType } from "@spiel-wedding/types/AdminContextType";
import { User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

export const AdminViewContext = createContext<AdminContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

const AdminViewProvider = ({ children }: Props): JSX.Element => {
  const supabase = createClient();
  const [user, setUser] = useState<User>();
  const [isAdminViewEnabled, setIsAdminViewEnabled] = useState(false);
  const [lastViewedPhoto, setLastViewedPhoto] = useState<string>();

  const toggleIsAdminViewEnabled = (): void => {
    setIsAdminViewEnabled(!isAdminViewEnabled);
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(undefined);
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AdminViewContext.Provider
      value={{
        isAdminViewEnabled,
        user,
        lastViewedPhoto,
        setUser,
        toggleIsAdminViewEnabled,
        setLastViewedPhoto,
      }}
    >
      {children}
    </AdminViewContext.Provider>
  );
};

export default AdminViewProvider;

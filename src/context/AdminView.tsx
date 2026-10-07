"use client";

import { createClient } from "@spiel-wedding/database/client";
import { AdminContextType } from "@spiel-wedding/types/AdminContextType";
import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AdminViewContext = createContext<AdminContextType | undefined>(undefined);

const supabase = createClient();

interface Props {
  children: ReactNode;
}

const AdminViewProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAdminViewEnabled, setIsAdminViewEnabled] = useState(false);
  const [lastViewedPhoto, setLastViewedPhoto] = useState<string | undefined>(undefined);

  const toggleIsAdminViewEnabled = () => {
    setIsAdminViewEnabled((prev) => !prev);
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
    <AdminViewContext
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
    </AdminViewContext>
  );
};

export default AdminViewProvider;

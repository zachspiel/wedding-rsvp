"use client";

import { createContext, useState } from "react";
import { AdminContextType } from "@spiel-wedding/types/AdminContextType";

export const AdminViewContext = createContext<AdminContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

const AdminViewProvider = ({ children }: Props): JSX.Element => {
  const [isAdminViewEnabled, setIsAdminViewEnabled] = useState(false);

  const toggleIsAdminViewEnabled = (): void => {
    setIsAdminViewEnabled(!isAdminViewEnabled);
  };

  return (
    <AdminViewContext.Provider value={{ isAdminViewEnabled, toggleIsAdminViewEnabled }}>
      {children}
    </AdminViewContext.Provider>
  );
};

export default AdminViewProvider;

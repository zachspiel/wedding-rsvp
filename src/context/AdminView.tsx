import { createContext, useState } from "react";
import { AdminContextType } from "../types/AdminContextType";
import { FcProps } from "../types/fcProps";

export const AdminViewContext = createContext<AdminContextType | undefined>(undefined);

const AdminViewProvider = (props: FcProps): JSX.Element => {
  const [isAdminViewEnabled, setIsAdminViewEnabled] = useState(false);

  const toggleIsAdminViewEnabled = (): void => {
    setIsAdminViewEnabled(!isAdminViewEnabled);
  };

  return (
    <AdminViewContext.Provider value={{ isAdminViewEnabled, toggleIsAdminViewEnabled }}>
      {props.children}
    </AdminViewContext.Provider>
  );
};

export default AdminViewProvider;

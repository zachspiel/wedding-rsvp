import { useContext } from "react";
import { AdminViewContext } from "../context/AdminView";
import { AdminContextType } from "../types/AdminContextType";

const useAdminView = (): AdminContextType => {
  const adminContext = useContext(AdminViewContext) as AdminContextType;

  return { ...adminContext };
};

export default useAdminView;

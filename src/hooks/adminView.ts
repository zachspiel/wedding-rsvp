import { useContext } from "react";
import { AdminViewContext } from "@spiel-wedding/context/AdminView";
import { AdminContextType } from "@spiel-wedding/types/AdminContextType";

const useAdminView = (): AdminContextType => {
  const adminContext = useContext(AdminViewContext) as AdminContextType;

  return { ...adminContext };
};

export default useAdminView;

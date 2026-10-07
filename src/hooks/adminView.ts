import { use } from "react";
import { AdminViewContext } from "@spiel-wedding/context/AdminView";
import { AdminContextType } from "@spiel-wedding/types/AdminContextType";

const useAdminView = (): AdminContextType => {
  const adminContext = use(AdminViewContext);

  if (!adminContext) {
    throw new Error("Admin Context is not initialized");
  }

  return adminContext;
};

export default useAdminView;

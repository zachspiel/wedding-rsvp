import { User } from "@supabase/supabase-js";

export type AdminContextType = {
  isAdminViewEnabled: boolean;
  user?: User;
  toggleIsAdminViewEnabled: () => void;
};

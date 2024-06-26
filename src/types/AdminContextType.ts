import { User } from "@supabase/supabase-js";

export type AdminContextType = {
  isAdminViewEnabled: boolean;
  user?: User;
  setUser: (user: User) => void;
  toggleIsAdminViewEnabled: () => void;
};

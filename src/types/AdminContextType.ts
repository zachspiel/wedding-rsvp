import { User } from "@supabase/supabase-js";

export type AdminContextType = {
  isAdminViewEnabled: boolean;
  user?: User;
  lastViewedPhoto?: string;
  setUser: (user: User) => void;
  toggleIsAdminViewEnabled: () => void;
  setLastViewedPhoto: (photo: string) => void;
};

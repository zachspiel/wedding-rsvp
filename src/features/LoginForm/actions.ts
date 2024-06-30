"use server";

import { createClient } from "@spiel-wedding/database/server";
import { LoginFormData } from "./types";

export async function login(formData: LoginFormData) {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return;
  }

  return data.user;
}

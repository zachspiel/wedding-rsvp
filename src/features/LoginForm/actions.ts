"use server";

import { createClient } from "@spiel-wedding/database/server";
import { LoginFormData } from "./types";
import { redirect } from "next/navigation";

export async function login(formData: LoginFormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    redirect("/error");
  }

  redirect("/");
}

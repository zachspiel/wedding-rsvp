"use server";

import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import { createClient } from "@spiel-wedding/database/server";
import { redirect } from "next/navigation";
import { LoginFormData } from "./types";

export async function login(formData: LoginFormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    redirect("/error");
  }

  await revalidatePage("/");
  redirect("/");
}

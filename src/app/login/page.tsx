import { redirect } from "next/navigation";
import { LoginForm } from "@spiel-wedding/features/LoginForm";
import { supabase } from "@spiel-wedding/database/database";

export default async function Login() {
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }

  return <LoginForm />;
}

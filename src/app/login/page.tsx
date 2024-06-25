import { createClient } from "@spiel-wedding/database/server";
import { LoginForm } from "@spiel-wedding/features/LoginForm";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }

  return <LoginForm />;
}

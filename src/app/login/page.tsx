import { createClient } from "@spiel-wedding/database/server";
import { LoginForm } from "@spiel-wedding/features/LoginForm";
import { redirect } from "next/navigation";

const checkLoginStatus = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    return redirect("/");
  }
};

export default async function LoginPage() {
  await checkLoginStatus();

  return <LoginForm />;
}

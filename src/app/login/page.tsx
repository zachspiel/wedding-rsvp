import { LoginForm } from "@spiel-wedding/features/LoginForm";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const checkLoginStatus = async () => {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    return redirect("/");
  }
};

export default async function Login() {
  await checkLoginStatus();

  return <LoginForm />;
}

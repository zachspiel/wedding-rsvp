import { createClient } from "@spiel-wedding/database/client";
import { redirect } from "next/navigation";
import { showFailureNotification } from "../../notifications/notifications";
import { ActionIcon } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { IconLogout } from "@tabler/icons-react";

interface Props {
  user: User | null;
}

const SignOutButton = ({ user }: Props): JSX.Element => {
  const supabase = createClient();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      showFailureNotification();
    } else {
      redirect("/login");
    }
  };

  return (
    <>
      {user && (
        <ActionIcon variant="subtle" onClick={signOut}>
          <IconLogout />
        </ActionIcon>
      )}
    </>
  );
};

export default SignOutButton;

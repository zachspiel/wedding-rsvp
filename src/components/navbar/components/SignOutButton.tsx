"use client";

import { useRouter } from "next/navigation";
import { showFailureNotification } from "../../notifications/notifications";
import { ActionIcon } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { IconLogout } from "@tabler/icons-react";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import { createClient } from "@spiel-wedding/database/client";

interface Props {
  user?: User;
}

const SignOutButton = ({ user }: Props): JSX.Element => {
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showFailureNotification();
    } else {
      router.push("/");
      await revalidatePage("/");
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

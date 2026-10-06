"use client";

import { ActionIcon } from "@mantine/core";
import revalidatePage from "@spiel-wedding/actions/revalidatePage";
import { createClient } from "@spiel-wedding/database/client";
import { User } from "@supabase/supabase-js";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { showFailureNotification } from "../../notifications/notifications";

interface Props {
  user?: User;
}

const SignOutButton = ({ user }: Props): ReactElement => {
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

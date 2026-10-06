"use client";

import { ActionIcon, Affix } from "@mantine/core";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { ReactElement } from "react";

const AdminViewToggle = (): ReactElement => {
  const { isAdminViewEnabled, user, toggleIsAdminViewEnabled } = useAdminView();

  const icon = isAdminViewEnabled ? <IconEye /> : <IconEyeOff />;

  if (!user) {
    return <></>;
  }

  return (
    <Affix position={{ bottom: 16, right: 16 }} zIndex={1001}>
      <ActionIcon
        variant="filled"
        bg="blue"
        size="lg"
        onClick={toggleIsAdminViewEnabled}
        style={{ zIndex: 101 }}
      >
        {icon}
      </ActionIcon>
    </Affix>
  );
};

export default AdminViewToggle;

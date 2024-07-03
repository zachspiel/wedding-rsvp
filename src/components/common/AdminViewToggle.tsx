"use client";

import { ActionIcon } from "@mantine/core";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import classes from "./common.module.css";

const AdminViewToggle = (): JSX.Element => {
  const { isAdminViewEnabled, user, toggleIsAdminViewEnabled } = useAdminView();

  const icon = isAdminViewEnabled ? <IconEye /> : <IconEyeOff />;

  if (!user) {
    return <></>;
  }

  return (
    <ActionIcon
      className={classes.toggleButton}
      variant="filled"
      bg="blue"
      onClick={toggleIsAdminViewEnabled}
      style={{ zIndex: 101 }}
    >
      {icon}
    </ActionIcon>
  );
};

export default AdminViewToggle;

import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import useAdminView from "@spiel-wedding/hooks/adminView";
import classes from "./common.module.css";

const AdminViewToggle = (): JSX.Element => {
  const { isAdminViewEnabled, toggleIsAdminViewEnabled } = useAdminView();

  const icon = isAdminViewEnabled ? <IconEye /> : <IconEyeOff />;

  return (
    <ActionIcon
      className={classes.toggleButton}
      variant="filled"
      color="blue"
      onClick={(): void => toggleIsAdminViewEnabled()}
    >
      {icon}
    </ActionIcon>
  );
};

export default AdminViewToggle;

import React from "react";
import { ActionIcon, createStyles } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons";
import useAdminView from "../../hooks/adminView";

const useStyles = createStyles((theme) => ({
  toggleButton: {
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
    zIndex: 1001,
  },
}));

const AdminViewToggle = (): JSX.Element => {
  const { classes } = useStyles();
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

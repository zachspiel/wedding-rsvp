import React from "react";
import { createStyles, Paper, Group, Text } from "@mantine/core";
import { GuestMessage } from "./GuestBook";
import { IconPencil } from "@tabler/icons";

interface Props {
  message: GuestMessage;
}

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

const GuestBookMessage = (props: Props): JSX.Element => {
  const { classes } = useStyles();
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group align="right">
        <IconPencil />
      </Group>
      <Group className={classes.body}>
        <div className={classes.content} style={{ fontFamily: `Poppins, sans-serif` }}>
          "{props.message.message}"
        </div>
      </Group>
      <Group>
        <div>
          <Text size="sm">
            <Text size="xs" color="dimmed">
              by {props.message.name} -{" "}
              {new Date(props.message.createdAt ?? "").toDateString()}
            </Text>
          </Text>
        </div>
      </Group>
    </Paper>
  );
};

export default GuestBookMessage;

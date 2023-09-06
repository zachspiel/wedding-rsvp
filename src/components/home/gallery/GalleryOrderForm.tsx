"use client";

import { createStyles, Divider, Flex, rem, Text, Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IconGripVertical } from "@tabler/icons-react";

import { Photo } from "@spiel-wedding/types/Photo";
import Image from "next/image";
import { useEffect } from "react";
import { database } from "@spiel-wedding/database/database";
import { ref, set } from "firebase/database";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";

interface Props {
  photos: Photo[];
}

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    paddingLeft: `calc(${theme.spacing.xl} - ${theme.spacing.md})`, // to offset drag handle
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

const GalleryOrderForm = (props: Props): JSX.Element => {
  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(props.photos);

  useEffect(() => {
    if (props.photos !== state) {
      handlers.setState(props.photos);
    }
  }, [props.photos]);

  useEffect(() => {
    if (state !== props.photos && state.length > 0) {
      const galleryRef = ref(database, "photos");

      set(galleryRef, state)
        .then(() => {
          showSuccessNotification("Successfully updated gallery order!");
        })
        .catch(showFailureNotification);
    }
  }, [state]);

  const items = state.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical size="1.05rem" stroke={1.5} />
          </div>
          <Flex gap="md">
            <Image
              src={item.downloadUrl}
              alt={item.caption ?? item.id}
              width={100}
              height={100}
            />
            <div>
              <Text>Position: {index + 1}</Text>
              <Text color="dimmed" size="sm">
                {(item.caption?.length ?? 0) > 0 ? item.caption : "No Caption"}
              </Text>
            </div>
          </Flex>
        </div>
      )}
    </Draggable>
  ));

  return (
    <>
      <Divider />
      <Title order={4}>Reorder Gallery</Title>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination?.index || 0 })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default GalleryOrderForm;

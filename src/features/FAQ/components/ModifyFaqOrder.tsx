"use client";

import { useDisclosure, useListState } from "@mantine/hooks";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import { Button, Modal, rem, Text } from "@mantine/core";
import cx from "clsx";
import classes from "../faq.module.css";
import { updateFAQs } from "@spiel-wedding/hooks/faq";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { mutate } from "swr";

interface Props {
  faqs: FrequentlyAskedQuestion[];
}

const ModifyFaqOrder = ({ faqs }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [state, handlers] = useListState(faqs);

  const items = state.map((item, index) => (
    <Draggable key={item.faq_id} index={index} draggableId={item.faq_id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.draggableItem, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </div>
          <div>
            <Text>{item.question}</Text>
            <Text c="dimmed" size="sm">
              {item.answer}
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ));

  const saveFaqs = async () => {
    const updatedFaqs = await updateFAQs(
      state.map((item, index) => ({ ...item, position: index })),
    );

    if (updatedFaqs) {
      showSuccessNotification("Saved FAQs!");
      await mutate("faq");
    } else {
      showFailureNotification();
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Modify FAQ Order"
        size="calc(50vw - 3rem)"
        centered
      >
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

        <Button onClick={saveFaqs}>Save</Button>
      </Modal>
      <Button onClick={open} ml="md">
        Modify FAQ order
      </Button>
    </>
  );
};

export default ModifyFaqOrder;

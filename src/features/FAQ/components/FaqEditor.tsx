"use client";

import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  Modal,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { v4 as uuid } from "uuid";
import { addFAQ, updateFAQ } from "@spiel-wedding/hooks/faq";
import {
  showFailureNotification,
  showSuccessNotification,
} from "@spiel-wedding/components/notifications/notifications";
import { mutate } from "swr";
import classes from "../faq.module.css";
import FaqPanel from "./FaqPanel";

interface Props {
  initialValues?: FrequentlyAskedQuestion;
  label: string;
  icon: JSX.Element;
}

const createDefaultFAQ = () => ({
  faq_id: uuid(),
  question: "",
  answer: "",
  position: 0,
});

const FaqEditor = ({ initialValues, icon, label }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FrequentlyAskedQuestion>({
    initialValues: initialValues ?? createDefaultFAQ(),
    validate: {
      question: isNotEmpty("Question can not be blank."),
      answer: isNotEmpty("Answer can not be blank."),
    },
  });

  const handleSubmit = async (faq: FrequentlyAskedQuestion) => {
    const successMessage = initialValues ? "Modified FAQ!" : "Added FAQ!";
    const result = initialValues ? await updateFAQ(faq) : await addFAQ(faq);

    if (result) {
      showSuccessNotification(successMessage);
      await mutate("faq");

      if (!initialValues) {
        form.setInitialValues(createDefaultFAQ());
        form.reset();
      }
    } else {
      showFailureNotification();
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Add FAQ"
        size="calc(50vw - 3rem)"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Question"
            placeholder="Enter question"
            {...form.getInputProps("question")}
          />
          <Textarea
            label="Answer"
            placeholder="Enter answer"
            className={classes.textArea}
            autosize
            minRows={5}
            maxRows={10}
            {...form.getInputProps("answer")}
          />

          <Group justify="end" mt="md">
            <Button disabled={!form.isValid()} type="submit">
              Save
            </Button>
          </Group>
        </form>

        {form.isValid() && (
          <>
            <Group align="center">
              <Title order={4} fw="normal" mt="md">
                Preview
              </Title>
            </Group>

            <Accordion variant="separated" classNames={classes}>
              <FaqPanel faq={form.values} />
            </Accordion>
          </>
        )}
      </Modal>
      {initialValues && <ActionIcon onClick={open}>{icon}</ActionIcon>}
      {!initialValues && (
        <Button leftSection={icon} onClick={open}>
          {label}
        </Button>
      )}
    </>
  );
};

export default FaqEditor;

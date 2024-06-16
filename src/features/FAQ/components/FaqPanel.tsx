"use client";

import {
  Anchor,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Text,
} from "@mantine/core";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { FaqElement, FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { IconPencil } from "@tabler/icons-react";
import DarkModeToggle from "./DarkModeToggle";
import DeleteFAQ from "./DeleteFAQ";
import FaqEditor from "./FaqEditor";
import WeddingColors from "./WeddingColors";
import classes from "../faq.module.css";

interface Props {
  faq: FrequentlyAskedQuestion;
  showControls?: boolean;
}

const FaqPanel = ({ faq, showControls = false }: Props) => {
  const { isAdminViewEnabled } = useAdminView();

  const getElement = (element: FaqElement) => {
    switch (element) {
      case "dark-mode-toggle": {
        return <DarkModeToggle />;
      }
      case "dress-code": {
        return (
          <Text c="dimmed">
            Our dress code is formal/cocktail attire. Please check out this{" "}
            <Anchor
              href="https://www.brides.com/story/wedding-dress-code-explained"
              target="_blank"
              c="blue"
            >
              cheat sheet
            </Anchor>{" "}
            if you need further explanation.
          </Text>
        );
      }
      default: {
        return <WeddingColors />;
      }
    }
  };

  return (
    <AccordionItem key={faq.question} value={faq.question}>
      <AccordionControl>{faq.question}</AccordionControl>
      <AccordionPanel className={classes.textArea}>
        <Text c="dimmed">
          {faq.answer} {faq.element && getElement(faq.element)}
        </Text>
        {isAdminViewEnabled && showControls && (
          <>
            <FaqEditor icon={<IconPencil />} initialValues={faq} label="" />
            <DeleteFAQ faq={faq} />
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default FaqPanel;

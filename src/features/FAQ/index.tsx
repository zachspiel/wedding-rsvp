"use client";

import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Center,
  Skeleton,
} from "@mantine/core";
import { FaqElement } from "@spiel-wedding/types/FAQ";
import classes from "./faq.module.css";
import DarkModeToggle from "./components/DarkModeToggle";
import WeddingColors from "./components/WeddingColors";
import useSWR from "swr";
import { getFAQs } from "@spiel-wedding/hooks/faq";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import FaqEditor from "./components/FaqEditor";
import DeleteFAQ from "./components/DeleteFAQ";
import ModifyFaqOrder from "./components/ModifyFaqOrder";

const FAQ = () => {
  const { data, isLoading } = useSWR("faq", getFAQs, { fallbackData: [] });
  const { isAdminViewEnabled } = useAdminView();

  const getElement = (element: FaqElement) => {
    if (element === "dark-mode-toggle") {
      return <DarkModeToggle />;
    }

    return <WeddingColors />;
  };

  return (
    <SectionContainer greenBackground flowerImages>
      <SectionTitle title="FAQ" id="faq" hideFlowers />

      {isAdminViewEnabled && (
        <Center>
          <FaqEditor icon={<IconPlus />} label="Add FAQ" />
          <ModifyFaqOrder faqs={data} />
        </Center>
      )}

      {isLoading && (
        <>
          <Skeleton w={100} m="md" />
          <Skeleton w={100} m="md" />
          <Skeleton w={100} m="md" />
        </>
      )}
      <Accordion multiple variant="separated" classNames={classes}>
        {data
          .sort((a, b) => a.position - b.position)
          .map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionControl>{item.question}</AccordionControl>
              <AccordionPanel>
                {item.answer} {item.element && getElement(item.element)}
                {isAdminViewEnabled && (
                  <>
                    <FaqEditor icon={<IconPencil />} initialValues={item} label="" />
                    <DeleteFAQ faq={item} />
                  </>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </SectionContainer>
  );
};

export default FAQ;

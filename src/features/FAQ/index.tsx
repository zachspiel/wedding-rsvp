"use client";

import { Accordion, ActionIcon, Group, TextInput, rem } from "@mantine/core";
import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import FaqAdminControls from "./components/FaqAdminControls";
import FaqPanel from "./components/FaqPanel";
import classes from "./faq.module.css";

interface Props {
  faqs: FrequentlyAskedQuestion[];
}

const FAQ = ({ faqs }: Props) => {
  const [search, setSearch] = useState("");

  const getMatchingFaqs = () => {
    if (search.length === 0) {
      return faqs;
    }

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer?.toLowerCase()?.includes(search.toLowerCase() ?? false)
    );
  };

  return (
    <SectionContainer greenBackground flowerImages>
      <SectionTitle title="FAQs" id="faq" hideFlowers />

      <FaqAdminControls faqs={faqs} />

      <Group p="md">
        <TextInput
          radius="xl"
          w="100%"
          placeholder="Search for question, topic or keyword"
          value={search}
          size="md"
          leftSection={
            <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          }
          rightSection={
            search.length > 0 && (
              <ActionIcon
                size={32}
                radius="xl"
                variant="filled"
                onClick={() => setSearch("")}
              >
                <IconX />
              </ActionIcon>
            )
          }
          onChange={(e) => setSearch(e.target.value)}
        />
      </Group>

      <Accordion variant="separated" classNames={classes}>
        {getMatchingFaqs()
          .sort((a, b) => a.position - b.position)
          .map((faq) => (
            <FaqPanel faq={faq} key={faq.faq_id} showControls={true} />
          ))}
      </Accordion>
    </SectionContainer>
  );
};

export default FAQ;

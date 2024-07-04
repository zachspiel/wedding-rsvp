"use client";

import { Accordion, ActionIcon, Center, Group, TextInput, rem } from "@mantine/core";
import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import FaqEditor from "./components/FaqEditor";
import FaqPanel from "./components/FaqPanel";
import ModifyFaqOrder from "./components/ModifyFaqOrder";
import classes from "./faq.module.css";

interface Props {
  faqs: FrequentlyAskedQuestion[];
}

const FAQ = ({ faqs }: Props) => {
  const { isAdminViewEnabled } = useAdminView();
  const [searchValue, setSearchValue] = useState("");

  return (
    <SectionContainer greenBackground flowerImages>
      <SectionTitle title="FAQs" id="faq" hideFlowers />

      {isAdminViewEnabled && (
        <Center>
          <FaqEditor icon={<IconPlus />} label="Add FAQ" />
          <ModifyFaqOrder faqs={faqs} />
        </Center>
      )}

      <Group p="md">
        <TextInput
          radius="xl"
          w="100%"
          placeholder="Search for question, topic or keyword"
          value={searchValue}
          size="md"
          leftSection={
            <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          }
          rightSection={
            searchValue.length > 0 && (
              <ActionIcon
                size={32}
                radius="xl"
                variant="filled"
                onClick={() => setSearchValue("")}
              >
                <IconX />
              </ActionIcon>
            )
          }
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Group>

      <Accordion variant="separated" classNames={classes}>
        {faqs
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchValue.toLowerCase()) ||
              faq.answer?.toLowerCase()?.includes(searchValue.toLowerCase() ?? false)
          )
          .sort((a, b) => a.position - b.position)
          .map((faq) => (
            <FaqPanel faq={faq} key={faq.faq_id} showControls={true} />
          ))}
      </Accordion>
    </SectionContainer>
  );
};

export default FAQ;

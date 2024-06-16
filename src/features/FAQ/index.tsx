"use client";

import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import {
  Accordion,
  ActionIcon,
  Card,
  Center,
  Group,
  Skeleton,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import classes from "./faq.module.css";
import useSWR from "swr";
import { getFAQs } from "@spiel-wedding/hooks/faq";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import FaqEditor from "./components/FaqEditor";
import ModifyFaqOrder from "./components/ModifyFaqOrder";
import FaqPanel from "./components/FaqPanel";
import { useState } from "react";

const FAQ = () => {
  const { data: faqs, isLoading } = useSWR("faq", getFAQs, { fallbackData: [] });
  const { isAdminViewEnabled } = useAdminView();
  const [searcValue, setSearchValue] = useState("");

  return (
    <SectionContainer greenBackground flowerImages>
      <SectionTitle title="FAQs" id="faq" hideFlowers />

      {isAdminViewEnabled && (
        <Center>
          <FaqEditor icon={<IconPlus />} label="Add FAQ" />
          <ModifyFaqOrder faqs={faqs} />
        </Center>
      )}

      {isLoading && (
        <>
          <Skeleton w={100} m="md" />
          <Skeleton w={100} m="md" />
          <Skeleton w={100} m="md" />
        </>
      )}

      <Card h={100}>
        <Card.Section p="md">
          <Title order={4} fw="normal">
            Search for a FAQ
          </Title>
          <TextInput
            placeholder="Enter a question, topic or keyword"
            value={searcValue}
            size="md"
            leftSection={
              <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            }
            rightSection={
              searcValue.length > 0 && (
                <ActionIcon onClick={() => setSearchValue("")} variant="subtle">
                  <IconX />
                </ActionIcon>
              )
            }
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Card.Section>
      </Card>

      <Accordion variant="separated" classNames={classes}>
        {faqs
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(searcValue.toLowerCase()) ||
              faq.answer?.toLowerCase()?.includes(searcValue.toLowerCase() ?? false)
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

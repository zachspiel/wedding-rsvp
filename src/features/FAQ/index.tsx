import { Accordion } from "@mantine/core";
import { SectionContainer, SectionTitle } from "@spiel-wedding/components/common";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import FaqAdminControls from "./components/FaqAdminControls";
import FaqPanel from "./components/FaqPanel";
import FaqSearchbar from "./components/FaqSearchbar";
import classes from "./faq.module.css";

interface Props {
  faqs: FrequentlyAskedQuestion[];
  query?: string;
}

const FAQ = ({ faqs, query }: Props) => {
  return (
    <SectionContainer greenBackground flowerImages>
      <SectionTitle title="FAQs" id="faq" hideFlowers />

      <FaqAdminControls faqs={faqs} />

      <FaqSearchbar />

      <Accordion variant="separated" classNames={classes}>
        {faqs
          .filter((faq) =>
            query
              ? faq.question.toLowerCase().includes(query.toLowerCase()) ||
                faq.answer?.toLowerCase()?.includes(query.toLowerCase() ?? false)
              : true
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

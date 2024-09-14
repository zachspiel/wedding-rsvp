import { getFAQs } from "@spiel-wedding/hooks/faq";
import { describe, expect, test } from "vitest";

describe("FAQs", () => {
  test("Get FAQs", async () => {
    const faqs = await getFAQs();

    expect(faqs.length).toBeGreaterThan(0);
  });

  // test("Add FAQ", async () => {
  //   const faq: FrequentlyAskedQuestion = {
  //     faq_id: uuid(),
  //     question: "Test quesion",
  //     position: 20,
  //     answer: "Test answer",
  //   };

  //   const result = await addFAQ(faq);
  //   expect(result).toBeDefined();
  //   expect(result !== null).toBeTruthy();

  //   const modifiedFaq = { ...result, answer: "New Answer" } as FrequentlyAskedQuestion;
  //   const updatedFaq = await updateFAQ(modifiedFaq);

  //   expect(updatedFaq !== null).toBeTruthy();
  //   expect(updatedFaq?.answer).toBe("New Answer");

  //   const removalResult = await removeFAQ(updatedFaq?.faq_id ?? "");

  //   expect(removalResult !== null).toBeTruthy();
  // });
});

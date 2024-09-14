import { getFAQs } from "@spiel-wedding/hooks/faq";
import { describe, expect, test } from "vitest";

describe("FAQs", () => {
  test("Get FAQs", async () => {
    const faqs = await getFAQs();

    expect(faqs.length).toBeGreaterThan(0);
  });
});

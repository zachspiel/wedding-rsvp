import { createClient } from "@spiel-wedding/database/client";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";

const supabase = createClient();

export const getFAQs = async (): Promise<FrequentlyAskedQuestion[]> => {
  const { data } = await supabase.from("faq").select();

  return data ?? [];
};

export const updateFAQ = async (
  faq: FrequentlyAskedQuestion,
): Promise<FrequentlyAskedQuestion | null> => {
  const { data, error } = await supabase
    .from("faq")
    .update(faq)
    .eq("faq_id", faq.faq_id)
    .select();

  if (error) {
    console.error(`Error while updating FAQ: ${error}`);
  }

  return data?.[0];
};

export const updateFAQs = async (
  faqs: FrequentlyAskedQuestion[],
): Promise<FrequentlyAskedQuestion[] | null> => {
  const { data, error } = await supabase.from("faq").upsert(faqs).select();

  if (error) {
    console.error(`Error  updating multiple FAQs: ${error}`);
  }

  return data;
};

export const addFAQ = async (
  faq: FrequentlyAskedQuestion,
): Promise<FrequentlyAskedQuestion | null> => {
  const { data, error } = await supabase.from("faq").insert(faq).select();

  if (error) {
    console.error(`Error while bulk adding FAQ: ${error}`);
  }

  return data?.[0];
};

export const removeFAQ = async (id: string): Promise<FrequentlyAskedQuestion | null> => {
  const { data, error } = await supabase.from("faq").delete().eq("faq_id", id).select();

  if (error) {
    console.error(`Error while removing FAQ: ${error}`);
  }

  return data?.[0];
};

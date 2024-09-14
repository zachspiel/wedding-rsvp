import { createClient } from "@spiel-wedding/database/client";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";

export const getFAQs = async (): Promise<FrequentlyAskedQuestion[]> => {
  const supabase = createClient();
  const { data } = await supabase.from("faq").select();

  return data ?? [];
};

export const updateFAQ = async (
  faq: FrequentlyAskedQuestion
): Promise<FrequentlyAskedQuestion | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("faq")
    .update(faq)
    .eq("faq_id", faq.faq_id)
    .select();

  console.log(error);

  return data?.[0];
};

export const updateFAQs = async (
  faqs: FrequentlyAskedQuestion[]
): Promise<FrequentlyAskedQuestion[] | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("faq").upsert(faqs).select();

  console.log(error);

  return data;
};

export const addFAQ = async (
  faq: FrequentlyAskedQuestion
): Promise<FrequentlyAskedQuestion | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("faq").insert(faq).select();

  console.log(error);

  return data?.[0];
};

export const removeFAQ = async (id: string): Promise<FrequentlyAskedQuestion | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("faq").delete().eq("faq_id", id).select();

  console.log(error);

  return data?.[0];
};

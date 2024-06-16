export interface FrequentlyAskedQuestion {
  faq_id: string;
  question: string;
  position: number;
  answer?: string;
  element?: FaqElement;
}

export type FaqElement = "dark-mode-toggle" | "color-palette" | "dress-code";

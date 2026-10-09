"use server";

import { render } from "react-email";
import { addMessageToGuestBook } from "@spiel-wedding/hooks/guestbook";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import { createTransport } from "nodemailer";
import GuestBookMessageTemplate from "./GuestBookEmailTemplate";
import { TablesInsert } from "@spiel-wedding/types/supabase.types";

export async function saveGuestMessage(
  guestMessage: TablesInsert<"guestbook">,
): Promise<GuestMessage> {
  return addMessageToGuestBook(guestMessage);
}

export async function sendEmailForNewComment({ name, message }: GuestMessage) {
  const contactEmail = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const html = await render(GuestBookMessageTemplate({ guestName: name, message }));
  const mail = {
    from: process.env.EMAIL_RECIPIENTS,
    to: process.env.EMAIL,
    subject: "New message added to guest book!",
    html,
  };

  await contactEmail.sendMail(mail);
}

"use server";

import { render } from "@react-email/components";
import { addMessageToGuestBook } from "@spiel-wedding/hooks/guestbook";
import { GuestMessage } from "@spiel-wedding/types/Guest";
import * as nodemailer from "nodemailer";
import GuestBookMessageTemplate from "./GuestBookEmailTemplate";

export async function saveGuestMessage(
  guestMessage: Omit<GuestMessage, "id">
): Promise<GuestMessage> {
  return addMessageToGuestBook(guestMessage);
}

export async function sendEmailForNewComment({ name, message }: GuestMessage) {
  const contactEmail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mail = {
    from: process.env.EMAIL_RECIPIENTS,
    to: process.env.EMAIL,
    subject: "New message added to guest book!",
    html: render(GuestBookMessageTemplate({ guestName: name, message })),
  };

  await contactEmail.sendMail(mail);
}

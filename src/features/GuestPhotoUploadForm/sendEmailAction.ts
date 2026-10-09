"use server";

import { render } from "react-email";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import { createTransport } from "nodemailer";
import EmailTemplate from "./components/EmailTemplate";

interface Props {
  firstName: string;
  lastName: string;
  uploadedImages: GuestUploadedImage[];
}

export async function sendEmailForUploadedImages({
  firstName,
  lastName,
  uploadedImages,
}: Props) {
  const contactEmail = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const html = await render(EmailTemplate({ firstName, lastName, uploadedImages }));
  const mail = {
    from: process.env.EMAIL_RECIPIENTS,
    to: process.env.EMAIL,
    subject: `${firstName} ${lastName} uploaded images`,
    html,
  };

  await contactEmail.sendMail(mail);
}

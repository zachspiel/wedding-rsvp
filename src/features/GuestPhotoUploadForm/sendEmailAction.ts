"use server";

import { render } from "@react-email/components";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";
import * as nodemailer from "nodemailer";
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
    subject: `${firstName} ${lastName} uploaded images`,
    html: render(EmailTemplate({ firstName, lastName, uploadedImages })),
  };

  await contactEmail.sendMail(mail);
}

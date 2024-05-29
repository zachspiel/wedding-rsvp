"use server";

import * as nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { Group } from "@spiel-wedding/types/Guest";
import RsvpEmailTemplate from "./components/RsvpEmailTemplate";
import RsvpConfirmationEmailTemplate from "./components/RsvpConfirmationEmailTemplate";

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

async function sendRsvpConfirmation(group: Group) {
  const mail = {
    from: process.env.EMAIL_RECIPIENTS,
    to: group.email,
    subject: `Patriz Wedding RSVP Confirmation 🎉💍`,
    html: render(RsvpConfirmationEmailTemplate(group)),
  };

  await contactEmail.sendMail(mail);
}

export async function sendMail(group: Group) {
  const mail = {
    from: group.email,
    to: process.env.EMAIL_RECIPIENTS,
    subject: `${group.guests[0].firstName} RSVPed`,
    html: render(RsvpEmailTemplate(group)),
  };

  await sendRsvpConfirmation(group);
  const result = await contactEmail.sendMail(mail);

  return result.accepted;
}

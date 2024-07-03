"use server";

import * as nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { Event, Group } from "@spiel-wedding/types/Guest";
import RsvpEmailTemplate from "./components/RsvpEmailTemplate";
import RsvpConfirmationEmailTemplate from "./components/RsvpConfirmationEmailTemplate";

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

interface Props {
  group: Group;
  events: Event[];
}

async function sendRsvpConfirmation(props: Props) {
  const mail = {
    from: process.env.EMAIL_RECIPIENTS,
    to: props.group.email,
    subject: `Spielberger Wedding RSVP Confirmation 🎉💍`,
    html: render(RsvpConfirmationEmailTemplate(props)),
  };

  await contactEmail.sendMail(mail);
}

export async function sendMail(props: Props) {
  const mail = {
    from: props.group.email,
    to: process.env.EMAIL_RECIPIENTS,
    subject: `${props.group.guests[0].firstName} RSVPed`,
    html: render(RsvpEmailTemplate(props)),
  };

  await sendRsvpConfirmation(props);
  const result = await contactEmail.sendMail(mail);

  return result.accepted;
}

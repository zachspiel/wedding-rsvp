"use server";

import { createTransport } from "nodemailer";
import { render } from "react-email";
import { Event, Group } from "@spiel-wedding/types/Guest";
import RsvpEmailTemplate from "./components/RsvpEmailTemplate";
import RsvpConfirmationEmailTemplate from "./components/RsvpConfirmationEmailTemplate";

const contactEmail = createTransport({
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
  const html = await render(RsvpConfirmationEmailTemplate(props));

  const mail = {
    from: process.env.EMAIL_RECIPIENTS,
    to: props.group.email,
    subject: `Spielberger Wedding RSVP Confirmation 🎉💍`,
    html,
  };

  await contactEmail.sendMail(mail);
}

export async function sendMail(props: Props) {
  const html = await render(RsvpEmailTemplate(props));
  const mail = {
    from: props.group.email,
    to: process.env.EMAIL_RECIPIENTS,
    subject: `${props.group.guests[0].firstName} RSVPed`,
    html,
  };

  await sendRsvpConfirmation(props);
  const result = await contactEmail.sendMail(mail);

  return result.accepted;
}

import { Event } from "@spiel-wedding/types/Guest";
import { v4 as uuid } from "uuid";

export const mockEvents: Event[] = [
  {
    event_id: uuid(),
    order: 1,
    title: "Event One",
    date: "string",
    time: "Noon",
    address1: "Address one",
    address2: "",
    city: "city",
    state: "state",
    postal: "postal",
    location: "location",
    emoji: "emoji",
    auto_invite: true,
    attire: "formal",
    imageUrl: null,
  },
  {
    event_id: uuid(),
    order: 2,
    title: "Event Two",
    date: "string",
    time: "Noon",
    address1: "Address one",
    address2: "",
    city: "city",
    state: "state",
    postal: "postal",
    location: "location",
    emoji: "emoji",
    auto_invite: false, // This will prevent guests from being auto invited to event
    attire: "formal",
    imageUrl: null,
  },
];

import { BRIDE_NAME, GROOM_NAME } from "@spiel-wedding/constants";

export interface Group {
  group_id: string;
  email: string;
  affiliation: GuestAffiliation;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  inviteSent: boolean;
  invited: boolean;
  message: string;
  saveTheDateSent: boolean;
  dietaryRestrictions: string;
  guests: Guest[];
  edited_at?: string;
  created_at?: string;
  table: string;
}

export interface Guest {
  guest_id: string;
  groupId: string;
  title: string;
  firstName: string;
  lastName: string;
  nameUnknown: boolean;
  event_responses: EventResponse[];
  relationshipType: RelationshipType;
  responseMap: Record<string, EventResponse>;
}

export interface Event {
  event_id: string;
  order: number;
  title: string;
  date: string;
  time: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal: string;
  location: string;
  emoji: string;
  auto_invite: boolean;
  imageUrl: string | null;
  attire: string;
}

export interface EventResponse {
  response_id: string;
  eventId: string;
  rsvp: RsvpResponse;
  guestId: string;
  response_created_at?: string;
}

export enum RsvpResponse {
  NO_RESPONSE = "No Response",
  ACCEPTED = "Accepted",
  DECLINED = "Declined",
}

export enum GuestAffiliation {
  NONE = "None",
  GROOM_FAMILY = `${GROOM_NAME}'s Family`,
  GROOM_WEDDING_PARTY = `${GROOM_NAME}'s Wedding Party`,
  GROOM_FRIEND = `${GROOM_NAME}'s Friend`,
  GROOM_FAMILY_FRIEND = `${GROOM_NAME}'s Family Friend`,
  BRIDE_FAMILY = `${BRIDE_NAME}'s Family`,
  BRIDE_WEDDING_PARTY = `${BRIDE_NAME}'s Wedding Party`,
  BRIDE_FRIEND = `${BRIDE_NAME}'s Friend`,
  BRIDE_FAMILY_FRIEND = `${BRIDE_NAME}'s Family Friend`,
  BRIDE_AND_Groom_FRIEND = `${GROOM_NAME} and ${BRIDE_NAME}'s Friend`,
}

export enum RelationshipType {
  PRIMARY = "Primary",
  PARTNER = "Partner",
  CHILD = "Child",
}

export interface GuestMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isVisible: boolean;
  createdAt?: string;
  editedAt?: string;
}

export type PublicGuestMessage = Omit<GuestMessage, "email">;

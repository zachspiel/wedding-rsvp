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
  guests: Guest[];
  rsvpModifications?: RsvpModification[];
  edited_at?: string;
  created_at?: string;
}

export interface Guest {
  guest_id: string;
  groupId: string;
  title: string;
  firstName: string;
  lastName: string;
  nameUnknown: boolean;
  rsvp: RsvpResponse;
  event_responses: EventResponse[];
  relationshipType: RelationshipType;
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
}

export interface EventResponse {
  response_id: string;
  eventId: string;
  rsvp: RsvpResponse;
  guestId: string;
}

export interface EventWithResponses extends Event {
  event_responses: EventResponse[];
}

export interface RsvpModification {
  id: string;
  createdAt: string;
  groupId: string;
}

export enum RsvpResponse {
  NO_RESPONSE = "No Response",
  ACCEPTED = "Accepted",
  DECLINED = "Declined",
}

export enum GuestAffiliation {
  NONE = "None",
  ZACHARY_FAMILY = "Zachary's Family",
  ZACHARY_WEDDING_PARTY = "Zachary's Wedding Party",
  ZACHARY_FRIEND = "Zachary's Friend",
  ZACHARY_FAMILY_FRIEND = "Zachary's Family Friend",
  SEDONA_FAMILY = "Sedona's Family",
  SEDONA_WEDDING_PARTY = "Sedona's Wedding Party",
  SEDONA_FRIEND = "Sedona's Friend",
  SEDONA_FAMILY_FRIEND = "Sedona's Family Friend",
  ZACHARY_AND_SEDONA_FRIEND = "Zachary and Sedona's Friend",
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

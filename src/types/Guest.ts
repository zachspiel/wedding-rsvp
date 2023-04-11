export interface Group {
  id: string;
  phone: string;
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
}

export interface Guest {
  title: string;
  firstName: string;
  lastName: string;
  rsvp: RsvpResonse;
  relationshipType: RelationshipType;
}

export enum RsvpResonse {
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

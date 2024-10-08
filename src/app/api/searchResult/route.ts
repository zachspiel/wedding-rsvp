import { createClient } from "@spiel-wedding/database/server";
import { GROUP_TABLE } from "@spiel-wedding/hooks/guests";
import { Group, Guest } from "@spiel-wedding/types/Guest";
import { addEventResponseMapToGuest } from "@spiel-wedding/util";
import { NextRequest, NextResponse } from "next/server";

const guestMatchesSearch = (name: string, guest: Guest): boolean => {
  const nameLowerCase = name.toLowerCase().trim();
  const guestFirstName = guest.firstName.toLowerCase();
  const guestLastName = guest.lastName.toLowerCase();

  if (name.length === 0) {
    return false;
  }

  return guestFirstName + " " + guestLastName === nameLowerCase;
};

const createCantFindGuestErrorMessage = () => {
  return NextResponse.json(
    {
      info: `Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation.`,
    },
    { status: 400 }
  );
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const supabase = createClient();

  if (!name) {
    return createCantFindGuestErrorMessage();
  }

  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .select("*, guests(*, event_responses(*))")
    .returns<Group[]>();

  if (error || !data) {
    return createCantFindGuestErrorMessage();
  }

  const matchingResults = data.filter(
    (group) => group.guests.filter((guest) => guestMatchesSearch(name, guest)).length > 0
  );

  return NextResponse.json(
    matchingResults.map((group) => ({
      ...group,
      guests: addEventResponseMapToGuest(group.guests),
    }))
  );
}

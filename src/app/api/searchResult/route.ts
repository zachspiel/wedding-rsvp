import { createClient } from "@spiel-wedding/database/server";
import { GROUP_TABLE } from "@spiel-wedding/hooks/guests";
import { Guest } from "@spiel-wedding/types/Guest";
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const supabase = createClient();

  if (!name) {
    return NextResponse.json([]);
  }
  const { data, error } = await supabase
    .from(GROUP_TABLE)
    .select("*, guests(*, event_responses(*))");

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(
    data?.filter(
      (group) =>
        group.guests.filter((guest: Guest) => guestMatchesSearch(name, guest)).length > 0
    ) ?? []
  );
}

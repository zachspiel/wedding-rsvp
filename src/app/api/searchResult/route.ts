import { supabase } from "@spiel-wedding/database/database";
import { GROUP_TABLE } from "@spiel-wedding/hooks/guests";
import { Guest } from "@spiel-wedding/types/Guest";
import { NextRequest, NextResponse } from "next/server";

const guestMatchesSearch = (
  firstName: string,
  lastName: string,
  guest: Guest
): boolean => {
  const firstNameLowerCase = firstName.toLowerCase();
  const lastNameLowerCase = lastName.toLowerCase();
  const guestFirstName = guest.firstName.toLowerCase();
  const guestLastName = guest.lastName.toLowerCase();

  if (firstName.length === 0 || lastName.length === 0) {
    return false;
  }

  return guestFirstName == firstNameLowerCase && guestLastName == lastNameLowerCase;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");

  if (!firstName || !lastName) {
    return NextResponse.json([]);
  }
  const { data, error } = await supabase.from(GROUP_TABLE).select("*, guests(*)");

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(
    data?.filter(
      (group) =>
        group.guests.filter((guest: Guest) =>
          guestMatchesSearch(firstName, lastName, guest)
        ).length > 0
    ) ?? []
  );
}

import { Guest } from "../../../types/Guest";

const guestMatchesSearch = (
  firstName: string,
  lastName: string,
  guest: Guest,
): boolean => {
  const firstNameLowerCase = firstName.toLowerCase();
  const lastNameLowerCase = lastName.toLowerCase();
  const guestFirstName = guest.firstName.toLowerCase();
  const guestLastName = guest.lastName.toLowerCase();

  if (firstName.length === 0 || lastName.length === 0) {
    return false;
  }

  return (
    guestFirstName.includes(firstNameLowerCase) ||
    guestLastName.includes(lastNameLowerCase)
  );
};

export { guestMatchesSearch };

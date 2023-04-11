import { Guest } from "../../types/Guest";

const guestMatchesSearch = (searchValue: string, guest: Guest): boolean => {
    const firstName = searchValue.split(" ")?.[0]?.toLowerCase() ?? "";
    const lastName = searchValue.split(" ")?.[1]?.toLowerCase() ?? "";
    const guestFirstName = guest.firstName.toLowerCase();
    const guestLastName = guest.lastName.toLowerCase();

    if (firstName.length === 0 || lastName.length === 0) {
        return false;
    }

    return (
        guestFirstName.includes(firstName) || guestLastName.includes(lastName)
    );
};

export { guestMatchesSearch };

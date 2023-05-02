export interface MenuItem {
  label: string;
  link: string;
  className?: string;
}

export const links: MenuItem[] = [
  { label: "When & Where", link: "#whenAndWhere" },
  { label: "Guest Book", link: "#guestBook" },
  { label: "Gallery", link: "#gallery" },
  { label: "Registry", link: "#registry" },
  { label: "RSVP", link: "#rsvp" },
];
